import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit/rate-limiter';
import { getChannelData, getVideoData } from '@/lib/youtube/service';
import { parseYouTubeInput } from '@/lib/youtube/url-parser';
import { DiscoveredVideo, HiddenVideoScanResult } from '@/lib/youtube/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function getApiKey(): string | undefined {
  return process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_AP;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(ip, '/api/youtube/scan-hidden');
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit reached. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const input = body?.url || body?.input;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a valid YouTube channel, playlist, or video link.' },
        { status: 400 }
      );
    }

    const parsed = parseYouTubeInput(input);
    if (parsed.type === 'INVALID') {
      return NextResponse.json(
        { error: parsed.error || 'Invalid YouTube URL format.' },
        { status: 400 }
      );
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API service is temporarily unconfigured. Please try again later.' },
        { status: 503 }
      );
    }

    // 1. PLAYLIST SCAN
    if (parsed.type === 'PLAYLIST') {
      const plMetaRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${parsed.id}&key=${apiKey}`
      );
      const plMetaData = await plMetaRes.json();
      const plItem = plMetaData.items?.[0];

      const plTitle = plItem?.snippet?.title || 'YouTube Playlist';
      const plThumb =
        plItem?.snippet?.thumbnails?.medium?.url ||
        plItem?.snippet?.thumbnails?.default?.url ||
        '';
      const plChannel = plItem?.snippet?.channelTitle || 'YouTube Creator';

      // Fetch items
      const itemsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status,contentDetails&playlistId=${parsed.id}&maxResults=50&key=${apiKey}`
      );
      const itemsData = await itemsRes.json();
      const rawItems = itemsData.items || [];

      const unlistedVideos: DiscoveredVideo[] = [];
      const privateSlots: HiddenVideoScanResult['privateSlots'] = [];
      let publicCount = 0;

      for (const item of rawItems) {
        const status = item.status?.privacyStatus;
        const vId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
        if (!vId) continue;

        if (status === 'unlisted') {
          unlistedVideos.push({
            videoId: vId,
            title: item.snippet?.title || 'Unlisted Video',
            thumbnail:
              item.snippet?.thumbnails?.high?.url ||
              item.snippet?.thumbnails?.medium?.url ||
              `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
            publishedAt: item.snippet?.publishedAt || null,
            playlistId: parsed.id,
            playlistTitle: plTitle,
            privacyStatus: 'unlisted',
          });
        } else if (status === 'private') {
          privateSlots.push({
            videoId: vId,
            playlistId: parsed.id,
            playlistTitle: plTitle,
            position: item.snippet?.position,
            note: 'The creator has set this video to Private or removed it from public access.',
          });
        } else {
          publicCount++;
        }
      }

      const result: HiddenVideoScanResult = {
        targetType: 'PLAYLIST',
        targetInfo: {
          id: parsed.id,
          title: plTitle,
          avatarOrThumb: plThumb,
          author: plChannel,
          totalVideosHint: rawItems.length,
        },
        stats: {
          playlistsScanned: 1,
          totalVideosScanned: rawItems.length,
          unlistedCount: unlistedVideos.length,
          privateSlotsCount: privateSlots.length,
          publicCount,
        },
        unlistedVideos,
        privateSlots,
        playlists: [
          {
            id: parsed.id,
            title: plTitle,
            itemCount: rawItems.length,
            thumbnail: plThumb,
            unlistedCount: unlistedVideos.length,
            privateCount: privateSlots.length,
          },
        ],
        explanation:
          'Scan completed. YouTube strictly restricts Private videos to the channel owner’s Google account. However, Unlisted videos embedded in playlists are discoverable.',
      };

      return NextResponse.json({ success: true, data: result });
    }

    // 2. CHANNEL SCAN
    let channelId = parsed.id;
    if (parsed.type === 'HANDLE' || parsed.type === 'CHANNEL') {
      const channel = await getChannelData(parsed.id, parsed.type === 'HANDLE');
      channelId = channel.id;
    }

    // Fetch channel details
    const channel = await getChannelData(channelId, false);

    // Fetch up to 15 playlists from channel
    const plRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails,status&channelId=${channel.id}&maxResults=15&key=${apiKey}`
    );
    const plData = await plRes.json();
    const playlistsList = plData.items || [];

    const unlistedVideos: DiscoveredVideo[] = [];
    const privateSlots: HiddenVideoScanResult['privateSlots'] = [];
    const playlistSummaries: HiddenVideoScanResult['playlists'] = [];
    let totalVideosScanned = 0;
    let publicCount = 0;

    // Scan top playlists
    for (const pl of playlistsList.slice(0, 10)) {
      try {
        const itemsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status,contentDetails&playlistId=${pl.id}&maxResults=50&key=${apiKey}`
        );
        const itemsData = await itemsRes.json();
        const items = itemsData.items || [];

        let plUnlisted = 0;
        let plPrivate = 0;

        for (const item of items) {
          totalVideosScanned++;
          const status = item.status?.privacyStatus;
          const vId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
          if (!vId) continue;

          if (status === 'unlisted') {
            plUnlisted++;
            // Deduplicate if already found in another playlist
            if (!unlistedVideos.some((v) => v.videoId === vId)) {
              unlistedVideos.push({
                videoId: vId,
                title: item.snippet?.title || 'Unlisted Video',
                thumbnail:
                  item.snippet?.thumbnails?.high?.url ||
                  item.snippet?.thumbnails?.medium?.url ||
                  `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
                publishedAt: item.snippet?.publishedAt || null,
                playlistId: pl.id,
                playlistTitle: pl.snippet?.title || 'Playlist',
                privacyStatus: 'unlisted',
              });
            }
          } else if (status === 'private') {
            plPrivate++;
            if (!privateSlots.some((s) => s.videoId === vId)) {
              privateSlots.push({
                videoId: vId,
                playlistId: pl.id,
                playlistTitle: pl.snippet?.title || 'Playlist',
                position: item.snippet?.position,
                note: 'Locked by channel creator (Private video status).',
              });
            }
          } else {
            publicCount++;
          }
        }

        playlistSummaries.push({
          id: pl.id,
          title: pl.snippet?.title || 'Untitled Playlist',
          itemCount: pl.contentDetails?.itemCount || items.length,
          thumbnail:
            pl.snippet?.thumbnails?.medium?.url ||
            pl.snippet?.thumbnails?.default?.url,
          unlistedCount: plUnlisted,
          privateCount: plPrivate,
        });
      } catch (err) {
        console.warn(`Error scanning playlist ${pl.id}:`, err);
      }
    }

    const result: HiddenVideoScanResult = {
      targetType: 'CHANNEL',
      targetInfo: {
        id: channel.id,
        title: channel.title,
        avatarOrThumb: channel.avatarUrl,
        author: channel.handle || channel.title,
        totalVideosHint: channel.videoCount,
      },
      stats: {
        playlistsScanned: playlistSummaries.length,
        totalVideosScanned,
        unlistedCount: unlistedVideos.length,
        privateSlotsCount: privateSlots.length,
        publicCount,
      },
      unlistedVideos,
      privateSlots,
      playlists: playlistSummaries,
      explanation:
        'Completed full scan of channel playlists. Any Unlisted videos organized within playlists are listed below. Truly Private videos are cryptographically locked by Google and cannot be viewed without the owner’s account credentials.',
    };

    return NextResponse.json({ success: true, data: result });
  } catch (err: unknown) {
    console.error('Error in /api/youtube/scan-hidden:', err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while scanning for hidden/unlisted videos. Please try again.',
      },
      { status: 500 }
    );
  }
}
