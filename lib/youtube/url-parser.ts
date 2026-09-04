export type YouTubeTargetType = 'VIDEO' | 'CHANNEL' | 'HANDLE' | 'CHANNEL_ID' | 'INVALID';

export interface ParsedYouTubeTarget {
  type: YouTubeTargetType;
  id: string; // Video ID, Channel ID, or Handle
  normalizedUrl: string;
  rawInput: string;
  error?: string;
}

/**
 * Validates and parses user-submitted YouTube URLs, handles, or IDs.
 * Strictly checks domains to prevent SSRF and malformed requests.
 */
export function parseYouTubeInput(input: string): ParsedYouTubeTarget {
  const trimmed = (input || '').trim();

  if (!trimmed) {
    return {
      type: 'INVALID',
      id: '',
      normalizedUrl: '',
      rawInput: trimmed,
      error: 'Please enter a YouTube channel or video URL, handle, or ID.',
    };
  }

  // 1. Check if raw video ID: 11 characters (alphanumeric + _ -)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      type: 'VIDEO',
      id: trimmed,
      normalizedUrl: `https://www.youtube.com/watch?v=${trimmed}`,
      rawInput: trimmed,
    };
  }

  // 2. Check if raw channel ID: starts with UC and has 24 chars
  if (/^UC[a-zA-Z0-9_-]{22}$/.test(trimmed)) {
    return {
      type: 'CHANNEL_ID',
      id: trimmed,
      normalizedUrl: `https://www.youtube.com/channel/${trimmed}`,
      rawInput: trimmed,
    };
  }

  // 3. Check if raw handle: starts with @
  if (/^@[a-zA-Z0-9_.-]{3,30}$/.test(trimmed)) {
    const handle = trimmed.slice(1);
    return {
      type: 'HANDLE',
      id: handle,
      normalizedUrl: `https://www.youtube.com/@${handle}`,
      rawInput: trimmed,
    };
  }

  // 4. Try parsing as URL
  let parsedUrl: URL;
  try {
    // Add protocol if user typed youtube.com/... without https://
    const urlString = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
    parsedUrl = new URL(urlString);
  } catch {
    return {
      type: 'INVALID',
      id: '',
      normalizedUrl: '',
      rawInput: trimmed,
      error: 'Invalid URL format. Please provide a valid YouTube URL.',
    };
  }

  // Verify hostname is legitimate YouTube domain
  const host = parsedUrl.hostname.toLowerCase();
  const validHosts = [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtu.be',
    'music.youtube.com',
  ];

  const isValidHost = validHosts.some(vh => host === vh || host.endsWith('.' + vh));
  if (!isValidHost) {
    return {
      type: 'INVALID',
      id: '',
      normalizedUrl: '',
      rawInput: trimmed,
      error: 'Only official YouTube links (youtube.com, youtu.be) are supported.',
    };
  }

  const pathname = parsedUrl.pathname;

  // youtu.be/VIDEO_ID
  if (host === 'youtu.be' || host.endsWith('.youtu.be')) {
    const videoId = pathname.replace(/^\//, '').split('/')[0];
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return {
        type: 'VIDEO',
        id: videoId,
        normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
        rawInput: trimmed,
      };
    }
  }

  // youtube.com/watch?v=VIDEO_ID
  if (pathname === '/watch' || pathname === '/watch/') {
    const videoId = parsedUrl.searchParams.get('v');
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return {
        type: 'VIDEO',
        id: videoId,
        normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
        rawInput: trimmed,
      };
    }
  }

  // youtube.com/shorts/VIDEO_ID
  const shortsMatch = pathname.match(/^\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return {
      type: 'VIDEO',
      id: shortsMatch[1],
      normalizedUrl: `https://www.youtube.com/watch?v=${shortsMatch[1]}`,
      rawInput: trimmed,
    };
  }

  // youtube.com/embed/VIDEO_ID
  const embedMatch = pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return {
      type: 'VIDEO',
      id: embedMatch[1],
      normalizedUrl: `https://www.youtube.com/watch?v=${embedMatch[1]}`,
      rawInput: trimmed,
    };
  }

  // youtube.com/channel/UCxxxxxxxx
  const channelMatch = pathname.match(/^\/channel\/(UC[a-zA-Z0-9_-]{22})/);
  if (channelMatch && channelMatch[1]) {
    return {
      type: 'CHANNEL_ID',
      id: channelMatch[1],
      normalizedUrl: `https://www.youtube.com/channel/${channelMatch[1]}`,
      rawInput: trimmed,
    };
  }

  // youtube.com/@handle
  const handleMatch = pathname.match(/^\/@([a-zA-Z0-9_.-]{3,30})/);
  if (handleMatch && handleMatch[1]) {
    return {
      type: 'HANDLE',
      id: handleMatch[1],
      normalizedUrl: `https://www.youtube.com/@${handleMatch[1]}`,
      rawInput: trimmed,
    };
  }

  // youtube.com/c/CustomName or youtube.com/user/UserName
  const customMatch = pathname.match(/^\/(c|user)\/([a-zA-Z0-9_.-]+)/);
  if (customMatch && customMatch[2]) {
    return {
      type: 'CHANNEL',
      id: customMatch[2],
      normalizedUrl: `https://www.youtube.com/${customMatch[1]}/${customMatch[2]}`,
      rawInput: trimmed,
    };
  }

  return {
    type: 'INVALID',
    id: '',
    normalizedUrl: '',
    rawInput: trimmed,
    error: 'Could not recognize a valid YouTube video ID, channel handle, or channel URL.',
  };
}
