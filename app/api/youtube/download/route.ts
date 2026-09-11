import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoId, quality = '720p', format = 'mp4', title = 'video' } = body;

    if (!videoId) {
      return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const isAudio = format === 'mp3' || format === 'm4a';

    // 1. Try Cobalt API instances (Top standard for direct media links)
    const cobaltInstances = [
      'https://api.cobalt.tools/api/json',
      'https://cobalt-api.kwiatekm.pl/api/json',
      'https://api.wuk.sh/api/json',
    ];

    for (const endpoint of cobaltInstances) {
      try {
        const cobaltRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          },
          body: JSON.stringify({
            url: videoUrl,
            vQuality: quality.replace('p', ''),
            isAudioOnly: isAudio,
            aFormat: format === 'mp3' ? 'mp3' : 'best',
            filenamePattern: 'basic',
          }),
          signal: AbortSignal.timeout(4500),
        });

        if (cobaltRes.ok) {
          const data = await cobaltRes.json();
          const targetDownloadUrl = data.url || data.stream;
          if (targetDownloadUrl) {
            return NextResponse.json({
              success: true,
              downloadUrl: targetDownloadUrl,
              direct: true,
            });
          }
        }
      } catch (e) {
        // try next
      }
    }

    // 2. Try Invidious instances
    const invidiousInstances = [
      'https://inv.tux.pizza',
      'https://invidious.nerdvpn.de',
      'https://yewtu.be',
      'https://invidious.jing.rocks',
    ];

    for (const inst of invidiousInstances) {
      try {
        const invRes = await fetch(`${inst}/api/v1/videos/${videoId}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: AbortSignal.timeout(4000),
        });

        if (invRes.ok) {
          const invData = await invRes.json();
          if (isAudio) {
            const audioStream =
              invData.adaptiveFormats?.find((f: any) => f.type?.includes('audio') || f.container === 'm4a') ||
              invData.adaptiveFormats?.[0];
            if (audioStream?.url) {
              return NextResponse.json({
                success: true,
                downloadUrl: audioStream.url,
                direct: true,
              });
            }
          } else {
            const formatStream =
              invData.formatStreams?.find((s: any) => s.qualityLabel?.includes(quality)) ||
              invData.formatStreams?.find((s: any) => s.qualityLabel?.includes('720p')) ||
              invData.formatStreams?.find((s: any) => s.qualityLabel?.includes('360p')) ||
              invData.formatStreams?.[0];

            if (formatStream?.url) {
              return NextResponse.json({
                success: true,
                downloadUrl: formatStream.url,
                direct: true,
              });
            }
          }
        }
      } catch (e) {
        // try next
      }
    }

    // 3. Try Piped API instances
    const pipedInstances = [
      'https://pipedapi.kavin.rocks',
      'https://api.piped.privacy.com.de',
    ];

    for (const piped of pipedInstances) {
      try {
        const pRes = await fetch(`${piped}/streams/${videoId}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: AbortSignal.timeout(4000),
        });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (isAudio) {
            const aStream = pData.audioStreams?.[0];
            if (aStream?.url) {
              return NextResponse.json({
                success: true,
                downloadUrl: aStream.url,
                direct: true,
              });
            }
          } else {
            const vStream =
              pData.videoStreams?.find((v: any) => v.quality === quality) || pData.videoStreams?.[0];
            if (vStream?.url) {
              return NextResponse.json({
                success: true,
                downloadUrl: vStream.url,
                direct: true,
              });
            }
          }
        }
      } catch (e) {
        // try next
      }
    }

    // 4. Reliable Direct Web Stream Resolvers
    const reliableGenerators = [
      `https://loader.to/api/button/?url=${encodeURIComponent(videoUrl)}&f=${format === 'mp3' ? 'mp3' : quality.replace('p', '')}`,
      `https://ssyoutube.com/watch?v=${videoId}`,
    ];

    return NextResponse.json({
      success: true,
      downloadUrl: reliableGenerators[0],
      direct: false,
      fallbackUrl: `https://www.youtube.com/watch?v=${videoId}`,
    });
  } catch (err: any) {
    console.error('Download resolver error:', err);
    return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 });
  }
}
