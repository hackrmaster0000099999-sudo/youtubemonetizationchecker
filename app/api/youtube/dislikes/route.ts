import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit/rate-limiter';
import { getVideoDislikes } from '@/lib/youtube/service';
import { parseYouTubeInput } from '@/lib/youtube/url-parser';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(ip, '/api/youtube/dislikes');
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
        { error: 'Please enter a valid YouTube video URL or 11-character video ID.' },
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

    if (parsed.type !== 'VIDEO') {
      return NextResponse.json(
        {
          error:
            'The Dislike Checker requires a specific YouTube video link (e.g. youtube.com/watch?v=... or youtu.be/...) rather than a channel link.',
        },
        { status: 400 }
      );
    }

    const result = await getVideoDislikes(parsed.id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    console.error('API Error in /api/youtube/dislikes:', err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Unable to retrieve dislike analytics for this video. Please check the URL and try again.',
      },
      { status: 500 }
    );
  }
}
