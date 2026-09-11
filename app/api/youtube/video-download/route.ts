import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit/rate-limiter';
import { getVideoData } from '@/lib/youtube/service';
import { parseYouTubeInput } from '@/lib/youtube/url-parser';
import { buildVideoDownloadResult } from '@/lib/youtube/downloader';
import { recentChecksStore } from '@/lib/recent-checks/store';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(ip, '/api/youtube/video-download');
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
        { error: 'Please enter a valid YouTube video URL or Video ID.' },
        { status: 400 }
      );
    }

    const parsed = parseYouTubeInput(input);
    if (parsed.type === 'INVALID') {
      return NextResponse.json(
        { error: parsed.error || 'Invalid YouTube video URL. Please provide a standard watch, Shorts, or youtu.be link.' },
        { status: 400 }
      );
    }

    if (parsed.type !== 'VIDEO') {
      return NextResponse.json(
        { error: 'Please provide a YouTube video URL or ID (channels cannot be downloaded as video files).' },
        { status: 400 }
      );
    }

    const video = await getVideoData(parsed.id);
    const result = buildVideoDownloadResult(video);

    try {
      recentChecksStore.addCheck({
        id: video.id,
        targetType: 'VIDEO',
        title: video.title,
        handle: video.channelHandle,
        avatarUrl: result.video.thumbnail,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        tool: 'video-downloader',
        category: 'Video',
        statusText: video.duration || 'Ready',
        statusType: 'neutral',
        metaText: video.channelTitle,
      });
    } catch (e) {
      console.warn('Failed to record recent check:', e);
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to analyze YouTube video.';
    console.error('API Error in /api/youtube/video-download:', message);
    return NextResponse.json(
      {
        error:
          message.includes('not found') || message.includes('private')
            ? message
            : "Could not retrieve video details from YouTube. Please check the URL and try again.",
      },
      { status: 500 }
    );
  }
}
