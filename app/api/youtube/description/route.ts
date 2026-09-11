import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit/rate-limiter';
import { getChannelData, getVideoData } from '@/lib/youtube/service';
import { parseYouTubeInput } from '@/lib/youtube/url-parser';
import { DescriptionAnalysis } from '@/lib/youtube/types';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function parseDescriptionMetadata(rawDesc: string) {
  const text = rawDesc || '';
  const lines = text.split(/\r?\n/).length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charLimitPercentage = Number(((characters / 5000) * 100).toFixed(1));

  // Extract timestamps: e.g. "0:00 Intro", "01:30 - First look", "1:15:20 Conclusion"
  const timestampRegex = /(?:^|\s)(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d)(?:\s*[-–—:]\s*|\s+)([^\n\r]+)/gm;
  const timestamps: Array<{ timestamp: string; label: string }> = [];
  let tMatch: RegExpExecArray | null;
  while ((tMatch = timestampRegex.exec(text)) !== null) {
    const rawTime = tMatch[1]
      ? `${tMatch[1]}:${tMatch[2]}:${tMatch[3]}`
      : `${tMatch[2]}:${tMatch[3]}`;
    const label = tMatch[4].trim();
    if (label && label.length < 80) {
      timestamps.push({ timestamp: rawTime, label });
    }
  }

  // Extract unique URLs
  const urlRegex = /(https?:\/\/[^\s<>'"]+)/gi;
  const urlMatches = text.match(urlRegex) || [];
  const uniqueUrls = [...new Set(urlMatches)];
  const links = uniqueUrls.map((url) => {
    let domain = '';
    try {
      domain = new URL(url).hostname.replace('www.', '');
    } catch {
      domain = url.slice(0, 30);
    }
    return { url, domain };
  });

  // Extract hashtags
  const hashtagRegex = /(?:^|\s)(#[a-zA-Z0-9_\u0980-\u09FF]+)/g;
  const hashtags: string[] = [];
  let hMatch: RegExpExecArray | null;
  while ((hMatch = hashtagRegex.exec(text)) !== null) {
    if (!hashtags.includes(hMatch[1])) {
      hashtags.push(hMatch[1]);
    }
  }

  return {
    stats: {
      characters,
      words,
      lines,
      charLimitPercentage,
    },
    timestamps,
    links,
    hashtags,
  };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(ip, '/api/youtube/description');
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
        { error: 'Please enter a valid YouTube video or channel link.' },
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

    if (parsed.type === 'VIDEO') {
      const video = await getVideoData(parsed.id);
      const thumb =
        video.thumbnails.maxres ||
        video.thumbnails.standard ||
        video.thumbnails.high ||
        video.thumbnails.medium ||
        video.thumbnails.default ||
        '';

      const parsedMeta = parseDescriptionMetadata(video.description || '');

      const responseData: DescriptionAnalysis = {
        type: 'VIDEO',
        id: video.id,
        title: video.title,
        author: video.channelTitle,
        channelId: video.channelId,
        thumbnail: thumb,
        description: video.description || '',
        viewCount: video.viewCount,
        publishedAt: video.publishedAt,
        ...parsedMeta,
      };

      return NextResponse.json({
        success: true,
        data: responseData,
      });
    }

    // Channel fallback
    if (parsed.type === 'CHANNEL_ID' || parsed.type === 'HANDLE' || parsed.type === 'CHANNEL') {
      const channel = await getChannelData(parsed.id, parsed.type === 'HANDLE');
      const parsedMeta = parseDescriptionMetadata(channel.description || '');

      const responseData: DescriptionAnalysis = {
        type: 'CHANNEL',
        id: channel.id,
        title: `${channel.title} (Channel About Info)`,
        author: channel.title,
        channelId: channel.id,
        thumbnail: channel.avatarUrl || '',
        description: channel.description || '',
        viewCount: channel.viewCount,
        publishedAt: channel.publishedAt,
        ...parsedMeta,
      };

      return NextResponse.json({
        success: true,
        data: responseData,
      });
    }

    return NextResponse.json(
      { error: 'Please enter a valid YouTube video link or channel link.' },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error('API Error in /api/youtube/description:', err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to extract YouTube description. Please check the URL and try again.',
      },
      { status: 500 }
    );
  }
}
