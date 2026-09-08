import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit/rate-limiter';
import { getChannelData, getVideoData } from '@/lib/youtube/service';
import { parseYouTubeInput } from '@/lib/youtube/url-parser';
import { recentChecksStore } from '@/lib/recent-checks/store';

// Cloudflare Pages Edge Runtime configuration
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(ip, '/api/youtube/lookup');
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
        { error: 'Please enter a valid YouTube channel or video URL.' },
        { status: 400 }
      );
    }

    const parsed = parseYouTubeInput(input);
    if (parsed.type === 'INVALID') {
      return NextResponse.json(
        { error: parsed.error || 'Invalid YouTube input format.' },
        { status: 400 }
      );
    }

    const tool = body?.tool || 'monetization-checker';

    if (parsed.type === 'VIDEO') {
      const video = await getVideoData(parsed.id);

      if (tool === 'monetization-checker') {
        try {
          const isMonetized =
            video.monetization?.status === 'Likely Monetized' ||
            video.monetization?.status === 'Monetization Signals Detected';

          recentChecksStore.addCheck({
            id: video.id,
            targetType: 'VIDEO',
            title: video.title,
            handle: video.channelHandle,
            avatarUrl:
              video.thumbnails?.high ||
              video.thumbnails?.medium ||
              `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            tool: 'monetization-checker',
            category: 'Monetization',
            statusText: isMonetized ? 'Monetized' : 'Not Monetized',
            statusType: isMonetized ? 'success' : 'danger',
            metaText: video.channelTitle,
          });
        } catch (e) {
          console.warn('Failed to record recent check:', e);
        }
      }

      return NextResponse.json({
        type: 'VIDEO',
        data: video,
      });
    }

    if (parsed.type === 'CHANNEL_ID' || parsed.type === 'HANDLE' || parsed.type === 'CHANNEL') {
      const channel = await getChannelData(parsed.id, parsed.type === 'HANDLE');

      if (tool === 'monetization-checker') {
        try {
          const isMonetized =
            channel.monetization?.status === 'Likely Monetized' ||
            channel.monetization?.status === 'Monetization Signals Detected';

          recentChecksStore.addCheck({
            id: channel.id,
            targetType: 'CHANNEL',
            title: channel.title,
            handle: channel.handle,
            avatarUrl: channel.avatarUrl,
            url: channel.channelUrl || `https://www.youtube.com/${channel.handle || `channel/${channel.id}`}`,
            tool: 'monetization-checker',
            category: 'Monetization',
            statusText: isMonetized ? 'Monetized' : 'Not Monetized',
            statusType: isMonetized ? 'success' : 'danger',
            metaText: channel.subscriberText || `${channel.title}`,
          });
        } catch (e) {
          console.warn('Failed to record recent check:', e);
        }
      }

      return NextResponse.json({
        type: 'CHANNEL',
        data: channel,
      });
    }

    return NextResponse.json(
      { error: 'Unsupported YouTube resource type.' },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve YouTube data.';
    console.error('API Error in /api/youtube/lookup:', message);
    return NextResponse.json(
      {
        error:
          message.includes('not found') || message.includes('private')
            ? message
            : "We couldn't retrieve the required public data right now. Please check the URL and try again.",
      },
      { status: 500 }
    );
  }
}
