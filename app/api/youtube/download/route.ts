import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get('id');
    const quality = searchParams.get('quality') || '720p';
    const format = searchParams.get('format') || 'mp4';
    const rawTitle = searchParams.get('title') || 'video';

    if (!videoId) {
      return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
    }

    const cleanTitle = rawTitle.replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 60) || 'youtube_video';
    const filename = `${cleanTitle}_${quality}.${format}`;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const isAudio = format === 'mp3' || format === 'm4a';

    // 1. Try public Cobalt instances for high-speed direct media streams
    const cobaltEndpoints = [
      'https://api.cobalt.tools/api/json',
      'https://cobalt-api.kwiatekm.pl/api/json',
      'https://api.wuk.sh/api/json',
    ];

    for (const endpoint of cobaltEndpoints) {
      try {
        const cobaltRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          },
          body: JSON.stringify({
            url: videoUrl,
            vQuality: quality.replace('p', ''),
            isAudioOnly: isAudio,
            aFormat: format === 'mp3' ? 'mp3' : 'best',
            filenamePattern: 'basic',
          }),
          signal: AbortSignal.timeout(4000),
        });

        if (cobaltRes.ok) {
          const data = await cobaltRes.json();
          if (data.url) {
            return NextResponse.redirect(data.url, 302);
          }
          if (data.stream) {
            return NextResponse.redirect(data.stream, 302);
          }
        }
      } catch (e) {
        // continue to next provider
      }
    }

    // 2. Try Invidious API instances for direct format streams
    const invidiousInstances = [
      'https://inv.tux.pizza',
      'https://invidious.nerdvpn.de',
      'https://yewtu.be',
      'https://invidious.jing.rocks',
    ];

    for (const inst of invidiousInstances) {
      try {
        const invRes = await fetch(`${inst}/api/v1/videos/${videoId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          },
          signal: AbortSignal.timeout(3500),
        });

        if (invRes.ok) {
          const invData = await invRes.json();
          if (isAudio) {
            const audioStream = invData.adaptiveFormats?.find((f: any) => f.type?.includes('audio') || f.container === 'm4a') || invData.adaptiveFormats?.[0];
            if (audioStream?.url) {
              return NextResponse.redirect(audioStream.url, 302);
            }
          } else {
            // Find video stream matching quality
            const formatStream =
              invData.formatStreams?.find((s: any) => s.qualityLabel?.includes(quality)) ||
              invData.formatStreams?.find((s: any) => s.qualityLabel?.includes('720p')) ||
              invData.formatStreams?.find((s: any) => s.qualityLabel?.includes('360p')) ||
              invData.formatStreams?.[0];

            if (formatStream?.url) {
              return NextResponse.redirect(formatStream.url, 302);
            }
          }
        }
      } catch (e) {
        // continue
      }
    }

    // 3. Fallback: Piped API instance stream extraction
    const pipedInstances = [
      'https://pipedapi.kavin.rocks',
      'https://api.piped.privacy.com.de',
    ];

    for (const piped of pipedInstances) {
      try {
        const pRes = await fetch(`${piped}/streams/${videoId}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: AbortSignal.timeout(3500),
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (isAudio) {
            const aStream = pData.audioStreams?.[0];
            if (aStream?.url) return NextResponse.redirect(aStream.url, 302);
          } else {
            const vStream = pData.videoStreams?.find((v: any) => v.quality === quality) || pData.videoStreams?.[0];
            if (vStream?.url) return NextResponse.redirect(vStream.url, 302);
          }
        }
      } catch (e) {
        // continue
      }
    }

    // 4. Default direct fallback link
    return NextResponse.redirect(`https://www.youtube.com/watch?v=${videoId}`, 302);
  } catch (err: any) {
    console.error('Download stream route error:', err);
    return NextResponse.json({ error: 'Failed to process media download stream' }, { status: 500 });
  }
}
