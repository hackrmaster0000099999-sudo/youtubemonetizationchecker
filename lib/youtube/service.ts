import { appCache, CACHE_TTL } from '@/lib/cache/memory-cache';
import { formatCompactNumber, formatNumber } from '@/lib/formatters/number';
import { ChannelData, DislikeAnalysis, MonetizationAnalysis, VideoCommentsResult, VideoData, YouTubeComment } from './types';

const COMMON_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const DEFAULT_DISCLAIMER =
  "Public data cannot always confirm a creator's official YouTube Partner Program status. This result is an estimate based on publicly observable signals and available data.";

function getYouTubeApiKey(): string | undefined {
  return process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_AP;
}

/**
 * Fetch video details by 11-char video ID.
 */
export async function getVideoData(videoId: string): Promise<VideoData> {
  const cacheKey = `video:${videoId}`;
  const cached = appCache.get<VideoData>(cacheKey);
  if (cached) return cached;

  const apiKey = getYouTubeApiKey();

  if (apiKey) {
    try {
      const data = await fetchVideoFromApi(videoId, apiKey);
      if (data) {
        appCache.set(cacheKey, data, CACHE_TTL.VIDEO_MS);
        return data;
      }
    } catch (err) {
      console.warn('YouTube API call failed, falling back to public extraction:', err);
    }
  }

  // Fallback to public YouTube page & oEmbed extraction
  const data = await fetchVideoFromPublicWeb(videoId);
  appCache.set(cacheKey, data, CACHE_TTL.VIDEO_MS);
  return data;
}

/**
 * Fetch channel details by Channel ID (UC...) or Handle.
 */
export async function getChannelData(identifier: string, isHandle = false): Promise<ChannelData> {
  const cacheKey = `channel:${identifier}`;
  const cached = appCache.get<ChannelData>(cacheKey);
  if (cached) return cached;

  const apiKey = getYouTubeApiKey();

  if (apiKey) {
    try {
      const data = await fetchChannelFromApi(identifier, isHandle, apiKey);
      if (data) {
        appCache.set(cacheKey, data, CACHE_TTL.CHANNEL_MS);
        return data;
      }
    } catch (err) {
      console.warn('YouTube API call failed, falling back to public extraction:', err);
    }
  }

  // Fallback to public web extraction
  const data = await fetchChannelFromPublicWeb(identifier, isHandle);
  appCache.set(cacheKey, data, CACHE_TTL.CHANNEL_MS);
  return data;
}

/**
 * Fetch video data via official YouTube Data API v3.
 */
async function fetchVideoFromApi(videoId: string, apiKey: string): Promise<VideoData | null> {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,status&id=${videoId}&key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`YouTube API returned ${res.status}`);

  const json = await res.json();
  const item = json.items?.[0];
  if (!item) throw new Error('Video not found or is private/removed.');

  const snippet = item.snippet || {};
  const stats = item.statistics || {};
  const content = item.contentDetails || {};
  const status = item.status || {};

  // Parse duration ISO 8601 (e.g. PT4M13S)
  const durationSecs = parseISO8601Duration(content.duration);
  const viewCount = stats.viewCount ? parseInt(stats.viewCount, 10) : null;
  const likeCount = stats.likeCount ? parseInt(stats.likeCount, 10) : null;
  const commentCount = stats.commentCount ? parseInt(stats.commentCount, 10) : null;

  const isAgeRestricted = content.contentRating?.ytRating === 'ytAgeRestricted';
  const madeForKids = status.madeForKids === true;
  const regionRestricted = !!(content.regionRestriction?.blocked || content.regionRestriction?.allowed);

  const signals = [
    {
      name: 'Embeddable & Public Syndication',
      detected: status.embeddable !== false && status.privacyStatus === 'public',
      description: 'The video is fully public and eligible for network distribution.',
    },
    {
      name: 'Content Restrictions Check',
      detected: !isAgeRestricted && !madeForKids,
      description: isAgeRestricted
        ? 'Video has age restrictions which may limit advertiser demand.'
        : madeForKids
        ? 'Marked as Made for Kids, which restricts personalized ads.'
        : 'Standard audience rating without major ad category restrictions.',
    },
    {
      name: 'License & Syndication',
      detected: snippet.licensedContent === true,
      description: 'Content is tagged with standard digital commercial licensing.',
    },
  ];

  let monetizationStatus: MonetizationAnalysis['status'] = 'Likely Monetized';
  let reason = 'Public monetization-related signals and standard ad eligibility markers were observed.';

  if (status.privacyStatus !== 'public') {
    monetizationStatus = 'Unable to Determine';
    reason = 'The video is not publicly listed, preventing reliable signal observation.';
  } else if (isAgeRestricted) {
    monetizationStatus = 'No Clear Monetization Signals';
    reason = 'Age-restricted content generally has limited or no monetization eligibility.';
  }

  return {
    id: videoId,
    title: snippet.title || 'Untitled Video',
    channelTitle: snippet.channelTitle || 'Unknown Channel',
    channelId: snippet.channelId || '',
    publishedAt: snippet.publishedAt || null,
    duration: content.duration ? formatDurationIso(content.duration) : null,
    durationSeconds: durationSecs,
    viewCount,
    viewCountText: formatNumber(viewCount),
    likeCount,
    likeCountText: formatNumber(likeCount),
    commentCount,
    category: snippet.categoryId ? `Category ID ${snippet.categoryId}` : null,
    tags: snippet.tags || [],
    description: snippet.description || '',
    thumbnails: {
      maxres: snippet.thumbnails?.maxres?.url || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      standard: snippet.thumbnails?.standard?.url || `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
      high: snippet.thumbnails?.high?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      medium: snippet.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      default: snippet.thumbnails?.default?.url || `https://i.ytimg.com/vi/${videoId}/default.jpg`,
    },
    restrictions: {
      isAgeRestricted,
      madeForKids,
      regionRestricted,
    },
    monetization: {
      status: monetizationStatus,
      confidence: 'high',
      signals,
      reason,
      disclaimer: DEFAULT_DISCLAIMER,
    },
  };
}

/**
 * Fetch channel data via official YouTube Data API v3.
 */
async function fetchChannelFromApi(identifier: string, isHandle: boolean, apiKey: string): Promise<ChannelData | null> {
  const queryParam = isHandle
    ? `forHandle=${encodeURIComponent(identifier.startsWith('@') ? identifier.slice(1) : identifier)}`
    : `id=${encodeURIComponent(identifier)}`;

  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&${queryParam}&key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`YouTube API returned ${res.status}`);

  const json = await res.json();
  const item = json.items?.[0];
  if (!item) throw new Error('Channel not found.');

  const snippet = item.snippet || {};
  const stats = item.statistics || {};
  const branding = item.brandingSettings || {};

  const subCount = stats.subscriberCount ? parseInt(stats.subscriberCount, 10) : null;
  const viewCount = stats.viewCount ? parseInt(stats.viewCount, 10) : null;
  const videoCount = stats.videoCount ? parseInt(stats.videoCount, 10) : null;

  const hasMinSubs = subCount !== null ? subCount >= 1000 : false;

  const signals = [
    {
      name: 'YPP Subscriber Threshold (1,000+)',
      detected: hasMinSubs,
      description: hasMinSubs
        ? `Channel meets the 1,000 subscriber benchmark (${formatCompactNumber(subCount)} subscribers).`
        : `Channel has ${formatCompactNumber(subCount)} subscribers (below 1,000 threshold).`,
    },
    {
      name: 'Public Activity & Video Library',
      detected: videoCount !== null && videoCount >= 3,
      description: `Channel has ${formatNumber(videoCount)} published public videos.`,
    },
    {
      name: 'Total Audience Engagement',
      detected: viewCount !== null && viewCount > 10000,
      description: `Accumulated ${formatNumber(viewCount)} lifetime views across public uploads.`,
    },
  ];

  let monetizationStatus: MonetizationAnalysis['status'] = 'Likely Monetized';
  let reason = 'Channel meets key public Partner Program eligibility indicators (including subscriber threshold).';

  if (videoCount === 0 || (subCount !== null && subCount < 1000) || (viewCount !== null && viewCount === 0)) {
    monetizationStatus = 'No Clear Monetization Signals';
    reason =
      videoCount === 0
        ? 'The channel has 0 public videos and does not meet the YouTube Partner Program (YPP) requirements.'
        : 'The channel has not yet reached the standard 1,000 subscriber threshold required for the YouTube Partner Program.';
  }

  return {
    id: item.id,
    title: snippet.title || 'Unknown Channel',
    handle: snippet.customUrl || (isHandle ? `@${identifier}` : ''),
    description: snippet.description || '',
    avatarUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
    bannerUrl: branding.image?.bannerExternalUrl || null,
    subscriberCount: subCount,
    subscriberText: formatNumber(subCount),
    viewCount,
    viewCountText: formatNumber(viewCount),
    videoCount,
    videoCountText: formatNumber(videoCount),
    publishedAt: snippet.publishedAt || null,
    country: snippet.country || null,
    customUrl: snippet.customUrl,
    channelUrl: `https://www.youtube.com/channel/${item.id}`,
    monetization: {
      status: monetizationStatus,
      confidence: 'medium',
      signals,
      reason,
      disclaimer: DEFAULT_DISCLAIMER,
    },
  };
}

/**
 * Public web extraction for video metadata (no API key required).
 */
async function fetchVideoFromPublicWeb(videoId: string): Promise<VideoData> {
  const pageUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const response = await fetch(pageUrl, {
    headers: {
      'User-Agent': COMMON_USER_AGENT,
      'Accept-Language': 'en-US,en;q=0.9',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Could not retrieve video from YouTube. The video may be private or removed.');
  }

  const html = await response.text();

  // Extract ytInitialPlayerResponse
  let playerResponse: Record<string, unknown> | null = null;
  const playerMatch = html.match(/var ytInitialPlayerResponse\s*=\s*({[\s\S]+?});/) ||
                      html.match(/ytInitialPlayerResponse\s*=\s*({[\s\S]+?});/);
  if (playerMatch && playerMatch[1]) {
    try {
      playerResponse = JSON.parse(playerMatch[1]);
    } catch {
      // Fallback
    }
  }

  const videoDetails = (playerResponse?.videoDetails as Record<string, unknown>) || {};
  const microformat = (playerResponse?.microformat as Record<string, unknown>)?.playerMicroformatRenderer as Record<string, unknown> || {};

  // Extract title
  let title = (videoDetails.title as string) || '';
  if (!title) {
    const titleMatch = html.match(/<meta\s+name="title"\s+content="([^"]+)"/i) ||
                       html.match(/<title>([^<]+) - YouTube<\/title>/i);
    title = titleMatch ? titleMatch[1] : `Video ${videoId}`;
  }

  // Extract channel name and ID
  const channelTitle = (videoDetails.author as string) || 'YouTube Creator';
  let channelId = (videoDetails.channelId as string) || '';
  if (!channelId) {
    const cidMatch = html.match(/"channelId":"(UC[a-zA-Z0-9_-]{22})"/);
    channelId = cidMatch ? cidMatch[1] : '';
  }

  const viewCount = videoDetails.viewCount ? parseInt(videoDetails.viewCount as string, 10) : null;
  const durationSecs = videoDetails.lengthSeconds ? parseInt(videoDetails.lengthSeconds as string, 10) : null;
  const tags = (videoDetails.keywords as string[]) || [];
  const publishedAt = (microformat.publishDate as string) || null;
  const category = (microformat.category as string) || null;

  // Check monetization signals
  const isFamilySafe = microformat.isFamilySafe !== false;
  const hasYpc = !!microformat.hasYpcMetadata;
  const isAgeRestricted = html.includes('"OG_RESTRICTED"') || html.includes('age-verification') || !isFamilySafe;
  const hasAdConfig = html.includes('adPlacements') || html.includes('adSlots') || html.includes('playerAds');
  const hasSponsorButton = html.includes('sponsorButtonRenderer') || html.includes('"isSponsor":');

  const signals = [
    {
      name: 'Advertising & Commercial Signals',
      detected: hasAdConfig || html.includes('ad_device'),
      description: hasAdConfig
        ? 'Observable ad break configurations and commercial ad-cue markers detected in video metadata.'
        : 'Ad break signals were not directly identifiable in public response.',
    },
    {
      name: 'Family Safe / Content Rating',
      detected: isFamilySafe && !isAgeRestricted,
      description: isFamilySafe && !isAgeRestricted
        ? 'Public classification meets general advertiser-friendly guidelines.'
        : 'Age restriction signals observed, which may restrict advertising.',
    },
    {
      name: 'Channel Commercial Features',
      detected: hasSponsorButton || hasYpc,
      description: hasSponsorButton
        ? 'Channel features active Membership/Join buttons associated with the YouTube Partner Program.'
        : 'Channel commercial badges were not directly observable on this page.',
    },
  ];

  let status: MonetizationAnalysis['status'] = 'Monetization Signals Detected';
  let reason = 'Public advertising configurations and eligibility markers were detected on this video.';

  if (hasSponsorButton || (hasAdConfig && isFamilySafe)) {
    status = 'Likely Monetized';
    reason = 'Observable ad configurations and family-friendly indicators indicate monetization is active.';
  } else if (isAgeRestricted) {
    status = 'No Clear Monetization Signals';
    reason = 'Age-restricted classification limits general monetization eligibility.';
  }

  return {
    id: videoId,
    title,
    channelTitle,
    channelId,
    publishedAt,
    duration: durationSecs ? `${Math.floor(durationSecs / 60)}:${(durationSecs % 60).toString().padStart(2, '0')}` : null,
    durationSeconds: durationSecs,
    viewCount,
    viewCountText: formatNumber(viewCount),
    likeCount: null, // YouTube does not publish exact likes in lightweight public HTML
    likeCountText: 'Not publicly available',
    commentCount: null,
    category,
    tags,
    description: (videoDetails.shortDescription as string) || '',
    thumbnails: {
      maxres: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
    },
    restrictions: {
      isAgeRestricted,
      madeForKids: html.includes('"isFamilyFriendly":false') || html.includes('"isMadeForKids":true'),
      regionRestricted: false,
    },
    monetization: {
      status,
      confidence: 'medium',
      signals,
      reason,
      disclaimer: DEFAULT_DISCLAIMER,
    },
  };
}

/**
 * Public web extraction for channel metadata (no API key required).
 */
async function fetchChannelFromPublicWeb(identifier: string, isHandle: boolean): Promise<ChannelData> {
  const targetUrl = isHandle
    ? `https://www.youtube.com/@${identifier.replace(/^@/, '')}`
    : `https://www.youtube.com/channel/${identifier}`;

  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent': COMMON_USER_AGENT,
      'Accept-Language': 'en-US,en;q=0.9',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Could not find that YouTube channel. Please check the URL or handle.');
  }

  const html = await response.text();

  // Extract Channel ID
  let channelId = '';
  const cidMatch = html.match(/"externalId":"(UC[a-zA-Z0-9_-]{22})"/);
  if (cidMatch) {
    channelId = cidMatch[1];
  } else if (!isHandle && identifier.startsWith('UC')) {
    channelId = identifier;
  } else {
    const metaCid = html.match(/itemprop="channelId"\s+content="(UC[a-zA-Z0-9_-]{22})"/);
    if (metaCid) channelId = metaCid[1];
  }

  if (!channelId) {
    throw new Error('Could not extract channel ID for this channel.');
  }

  // Extract channel name
  let title = 'YouTube Channel';
  const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                     html.match(/"channelMetadataRenderer":\s*{"title":"([^"]+)"/);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1];
  }

  // Extract avatar
  let avatarUrl = '';
  const avatarMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i) ||
                      html.match(/"avatar":\s*{"thumbnails":\s*\[{"url":"([^"]+)"/);
  if (avatarMatch && avatarMatch[1]) {
    avatarUrl = avatarMatch[1];
  }

  // Extract description
  let description = '';
  const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
  if (descMatch && descMatch[1]) {
    description = descMatch[1];
  }

  // Extract subscriber count
  let subCount: number | null = null;
  let subText = 'Not publicly available';
  const subMatch = html.match(/"subscriberCountText":\s*{"accessibility":\s*{"accessibilityData":\s*{"label":"([^"]+)"/i) ||
                    html.match(/"subscriberCountText":\s*{"simpleText":"([^"]+)"/i);
  if (subMatch && subMatch[1]) {
    subText = subMatch[1];
    const numericSub = parseSubscriberText(subMatch[1]);
    if (numericSub) subCount = numericSub;
  }

  // Extract video count
  let videoCount: number | null = null;
  let videoText = 'Not publicly available';
  const vidMatch = html.match(/"videosCountText":\s*{"accessibility":\s*{"accessibilityData":\s*{"label":"([^"]+)"/i) ||
                    html.match(/"videosCountText":\s*{"runs":\s*\[{"text":"([^"]+)"/i);
  if (vidMatch && vidMatch[1]) {
    videoText = vidMatch[1];
    const numericVid = parseInt(vidMatch[1].replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numericVid)) videoCount = numericVid;
  }

  // Check monetization signals in channel page
  const hasJoinButton = html.includes('sponsorButtonRenderer') || html.includes('"text":{"runs":[{"text":"Join"');
  const hasStoreTab = html.includes('"title":"Store"') || html.includes('merch');
  const hasMinSubs = subCount !== null ? subCount >= 1000 : false;

  const signals = [
    {
      name: 'YPP 1,000 Subscriber Threshold',
      detected: hasMinSubs,
      description: hasMinSubs
        ? `Channel meets the 1,000 subscriber requirement (${subText}).`
        : subCount !== null
        ? `Channel is currently below the 1,000 subscriber benchmark (${subText}).`
        : 'Subscriber count is hidden or not publicly stated.',
    },
    {
      name: 'Channel Memberships / Join Feature',
      detected: hasJoinButton,
      description: hasJoinButton
        ? 'Public Channel Memberships ("Join" button) are active, confirming YouTube Partner Program membership.'
        : 'No public Channel Membership button was observed.',
    },
    {
      name: 'Merchandise / Official Store Shelf',
      detected: hasStoreTab,
      description: hasStoreTab
        ? 'Official YouTube Shopping / Merch store shelf detected.'
        : 'No public Merch shelf observed on the channel homepage.',
    },
  ];

  let status: MonetizationAnalysis['status'] = 'Likely Monetized';
  let reason = 'Public monetization-related signals were detected for this channel.';

  if (videoCount === 0) {
    status = 'No Clear Monetization Signals';
    reason = 'This channel has 0 public videos and does not meet the YouTube Partner Program (YPP) requirements.';
  } else if (hasJoinButton || hasStoreTab) {
    status = 'Likely Monetized';
    reason = 'Active Channel Memberships or Shopping store detected, which are exclusive to YouTube Partner Program members.';
  } else if (subCount !== null && subCount < 1000) {
    status = 'No Clear Monetization Signals';
    reason = 'The channel appears to be below the standard 1,000 subscriber threshold required for the YouTube Partner Program.';
  } else if (!hasJoinButton && !hasStoreTab && subCount === null) {
    status = 'Unable to Determine';
    reason = 'Public subscriber and commercial markers are not publicly accessible for this channel.';
  }

  return {
    id: channelId,
    title,
    handle: isHandle ? `@${identifier.replace(/^@/, '')}` : '',
    description,
    avatarUrl,
    bannerUrl: null,
    subscriberCount: subCount,
    subscriberText: subText,
    viewCount: null,
    viewCountText: 'Not publicly available',
    videoCount,
    videoCountText: videoText,
    publishedAt: null,
    country: null,
    channelUrl: `https://www.youtube.com/channel/${channelId}`,
    monetization: {
      status,
      confidence: hasJoinButton ? 'high' : 'medium',
      signals,
      reason,
      disclaimer: DEFAULT_DISCLAIMER,
    },
  };
}

function parseSubscriberText(text: string): number | null {
  const match = text.match(/([0-9.,]+)\s*([KkMmBb])?/);
  if (!match) return null;
  const num = parseFloat(match[1].replace(/,/g, ''));
  if (isNaN(num)) return null;
  const unit = (match[2] || '').toUpperCase();
  if (unit === 'K') return Math.round(num * 1000);
  if (unit === 'M') return Math.round(num * 1000000);
  if (unit === 'B') return Math.round(num * 1000000000);
  return Math.round(num);
}

function parseISO8601Duration(iso: string): number {
  if (!iso) return 0;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hrs = parseInt(match[1] || '0', 10);
  const mins = parseInt(match[2] || '0', 10);
  const secs = parseInt(match[3] || '0', 10);
  return hrs * 3600 + mins * 60 + secs;
}

function formatDurationIso(iso: string): string {
  const secs = parseISO8601Duration(iso);
  const hrs = Math.floor(secs / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${mins}:${s.toString().padStart(2, '0')}`;
}

/**
 * Fetch video comments with support for sorting (relevance or time) and pagination.
 */
export async function getVideoComments(
  videoId: string,
  order: 'relevance' | 'time' = 'relevance',
  pageToken?: string
): Promise<VideoCommentsResult> {
  const cacheKey = `comments:${videoId}:${order}:${pageToken || 'first'}`;
  const cached = appCache.get<VideoCommentsResult>(cacheKey);
  if (cached) return cached;

  // Retrieve basic video data for thumbnail, title, channelTitle, etc.
  const videoData = await getVideoData(videoId);

  const apiKey = getYouTubeApiKey();
  if (apiKey) {
    try {
      const pageParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
      const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=50&order=${order}&key=${apiKey}${pageParam}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      const json = await res.json();

      if (!res.ok) {
        // Check if comments are disabled for this video
        const isCommentsDisabled =
          json.error?.errors?.some((e: { reason: string }) => e.reason === 'commentsDisabled') ||
          json.error?.message?.toLowerCase().includes('disabled comments');

        if (isCommentsDisabled) {
          const disabledResult: VideoCommentsResult = {
            video: {
              id: videoData.id,
              title: videoData.title,
              channelTitle: videoData.channelTitle,
              channelId: videoData.channelId,
              thumbnail:
                videoData.thumbnails.maxres ||
                videoData.thumbnails.high ||
                videoData.thumbnails.medium ||
                videoData.thumbnails.default ||
                '',
              commentCount: 0,
              viewCount: videoData.viewCount,
              likeCount: videoData.likeCount,
              publishedAt: videoData.publishedAt,
            },
            comments: [],
            totalLoaded: 0,
            commentsDisabled: true,
          };
          appCache.set(cacheKey, disabledResult, CACHE_TTL.SHORT_MS);
          return disabledResult;
        }

        throw new Error(json.error?.message || `YouTube API error: ${res.status}`);
      }

      interface CommentApiItem {
        id?: string;
        snippet?: {
          isPinned?: boolean;
          totalReplyCount?: number;
          topLevelComment?: {
            snippet?: {
              authorDisplayName?: string;
              authorProfileImageUrl?: string;
              authorChannelUrl?: string;
              authorChannelId?: { value?: string };
              textDisplay?: string;
              textOriginal?: string;
              likeCount?: number;
              publishedAt?: string;
            };
          };
        };
      }

      const comments: YouTubeComment[] = (json.items || []).map((item: CommentApiItem) => {
        const top = item.snippet?.topLevelComment?.snippet || {};
        return {
          id: item.id || `cmt_${Math.random().toString(36).slice(2, 10)}`,
          authorName: top.authorDisplayName || 'YouTube User',
          authorAvatarUrl: top.authorProfileImageUrl || '',
          authorChannelUrl:
            top.authorChannelUrl ||
            (top.authorChannelId?.value ? `https://www.youtube.com/channel/${top.authorChannelId.value}` : undefined),
          authorChannelId: top.authorChannelId?.value,
          text: top.textDisplay || top.textOriginal || '',
          likeCount: typeof top.likeCount === 'number' ? top.likeCount : 0,
          publishedAt: top.publishedAt || new Date().toISOString(),
          replyCount: typeof item.snippet?.totalReplyCount === 'number' ? item.snippet.totalReplyCount : 0,
          isPinned: !!item.snippet?.isPinned,
        };
      });

      const result: VideoCommentsResult = {
        video: {
          id: videoData.id,
          title: videoData.title,
          channelTitle: videoData.channelTitle,
          channelId: videoData.channelId,
          thumbnail:
            videoData.thumbnails.maxres ||
            videoData.thumbnails.high ||
            videoData.thumbnails.medium ||
            videoData.thumbnails.default ||
            '',
          commentCount: videoData.commentCount,
          viewCount: videoData.viewCount,
          likeCount: videoData.likeCount,
          publishedAt: videoData.publishedAt,
        },
        comments,
        totalLoaded: comments.length,
        nextPageToken: json.nextPageToken || null,
        commentsDisabled: false,
      };

      appCache.set(cacheKey, result, CACHE_TTL.SHORT_MS);
      return result;
    } catch (err) {
      console.warn('YouTube API commentThreads failed, attempting fallback extraction:', err);
    }
  }

  // Fallback if API key unavailable
  const fallbackResult = await fetchCommentsFromInnerTube(videoId, order, pageToken, videoData);
  appCache.set(cacheKey, fallbackResult, CACHE_TTL.SHORT_MS);
  return fallbackResult;
}

/**
 * Fallback comment extractor using YouTube public client endpoint
 */
async function fetchCommentsFromInnerTube(
  videoId: string,
  _order: 'relevance' | 'time',
  continuationToken: string | undefined,
  videoData: VideoData
): Promise<VideoCommentsResult> {
  try {
    let token = continuationToken;

    if (!token) {
      // Fetch watch next to find initial comments continuation token
      const nextRes = await fetch('https://www.youtube.com/youtubei/v1/next?prettyPrint=false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': COMMON_USER_AGENT,
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB',
              clientVersion: '2.20240101.00.00',
              hl: 'en',
              gl: 'US',
            },
          },
          videoId,
        }),
      });

      if (!nextRes.ok) throw new Error(`InnerTube request failed with ${nextRes.status}`);
      const nextJson = await nextRes.json();
      const sections = nextJson.contents?.twoColumnWatchNextResults?.results?.results?.contents;
      interface ItemSection {
        itemSectionRenderer?: {
          targetId?: string;
          contents?: Array<{
            continuationItemRenderer?: {
              continuationEndpoint?: {
                continuationCommand?: {
                  token?: string;
                };
              };
            };
          }>;
        };
      }
      const commentSection = sections?.find((s: ItemSection) => s.itemSectionRenderer?.targetId === 'comments-section');
      token =
        commentSection?.itemSectionRenderer?.contents?.[0]?.continuationItemRenderer?.continuationEndpoint
          ?.continuationCommand?.token;
    }

    if (!token) {
      return {
        video: {
          id: videoData.id,
          title: videoData.title,
          channelTitle: videoData.channelTitle,
          channelId: videoData.channelId,
          thumbnail:
            videoData.thumbnails.maxres ||
            videoData.thumbnails.high ||
            videoData.thumbnails.medium ||
            videoData.thumbnails.default ||
            '',
          commentCount: videoData.commentCount,
          viewCount: videoData.viewCount,
          likeCount: videoData.likeCount,
          publishedAt: videoData.publishedAt,
        },
        comments: [],
        totalLoaded: 0,
        commentsDisabled: videoData.commentCount === 0 || videoData.commentCount === null,
      };
    }

    const commRes = await fetch('https://www.youtube.com/youtubei/v1/next?prettyPrint=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': COMMON_USER_AGENT,
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20240101.00.00',
            hl: 'en',
            gl: 'US',
          },
        },
        continuation: token,
      }),
    });

    if (!commRes.ok) throw new Error('Failed to load continuation items');
    const commJson = await commRes.json();

    const comments: YouTubeComment[] = [];
    let nextToken: string | null = null;

    interface InnerTubeActionItem {
      commentThreadRenderer?: {
        comment?: {
          commentRenderer?: {
            commentId?: string;
            authorText?: { simpleText?: string };
            authorThumbnail?: { thumbnails?: Array<{ url: string }> };
            contentText?: { runs?: Array<{ text: string }> };
            voteCount?: { simpleText?: string };
            publishedTimeText?: { runs?: Array<{ text: string }> };
            replyCount?: number;
            authorEndpoint?: {
              commandMetadata?: {
                webCommandMetadata?: {
                  url?: string;
                };
              };
            };
          };
        };
      };
      continuationItemRenderer?: {
        continuationEndpoint?: {
          continuationCommand?: {
            token?: string;
          };
        };
      };
    }

    const endpoints = commJson.onResponseReceivedEndpoints || [];
    for (const ep of endpoints) {
      const items: InnerTubeActionItem[] =
        ep.reloadContinuationItemsCommand?.continuationItems || ep.appendContinuationItemsAction?.continuationItems || [];
      for (const it of items) {
        if (it.commentThreadRenderer?.comment?.commentRenderer) {
          const cr = it.commentThreadRenderer.comment.commentRenderer;
          const author = cr.authorText?.simpleText || 'YouTube User';
          const avatar = cr.authorThumbnail?.thumbnails?.[0]?.url || '';
          const text = cr.contentText?.runs?.map((r) => r.text).join('') || '';
          const likesText = cr.voteCount?.simpleText || '0';
          const likes = parseCompactLikes(likesText);
          const published = cr.publishedTimeText?.runs?.[0]?.text || '';
          const replyCount = cr.replyCount || 0;

          comments.push({
            id: cr.commentId || `it_${Math.random().toString(36).slice(2, 10)}`,
            authorName: author,
            authorAvatarUrl: avatar,
            authorChannelUrl: cr.authorEndpoint?.commandMetadata?.webCommandMetadata?.url
              ? `https://www.youtube.com${cr.authorEndpoint.commandMetadata.webCommandMetadata.url}`
              : undefined,
            text,
            likeCount: likes,
            publishedAt: published,
            replyCount,
          });
        } else if (it.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token) {
          nextToken = it.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
        }
      }
    }

    return {
      video: {
        id: videoData.id,
        title: videoData.title,
        channelTitle: videoData.channelTitle,
        channelId: videoData.channelId,
        thumbnail:
          videoData.thumbnails.maxres ||
          videoData.thumbnails.high ||
          videoData.thumbnails.medium ||
          videoData.thumbnails.default ||
          '',
        commentCount: videoData.commentCount,
        viewCount: videoData.viewCount,
        likeCount: videoData.likeCount,
        publishedAt: videoData.publishedAt,
      },
      comments,
      totalLoaded: comments.length,
      nextPageToken: nextToken,
      commentsDisabled: false,
    };
  } catch (e) {
    console.error('InnerTube fallback error:', e);
    return {
      video: {
        id: videoData.id,
        title: videoData.title,
        channelTitle: videoData.channelTitle,
        channelId: videoData.channelId,
        thumbnail:
          videoData.thumbnails.maxres ||
          videoData.thumbnails.high ||
          videoData.thumbnails.medium ||
          videoData.thumbnails.default ||
          '',
        commentCount: videoData.commentCount,
        viewCount: videoData.viewCount,
        likeCount: videoData.likeCount,
        publishedAt: videoData.publishedAt,
      },
      comments: [],
      totalLoaded: 0,
      commentsDisabled: false,
    };
  }
}

function parseCompactLikes(str: string): number {
  if (!str) return 0;
  const clean = str.trim().replace(/,/g, '');
  const match = clean.match(/([\d.]+)\s*([KkMm])?/);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  if (isNaN(val)) return 0;
  const unit = (match[2] || '').toUpperCase();
  if (unit === 'K') return Math.round(val * 1000);
  if (unit === 'M') return Math.round(val * 1000000);
  return Math.round(val);
}

/**
 * Fetch YouTube Dislikes and Sentiment Analysis using Return YouTube Dislike API and video data.
 */
export async function getVideoDislikes(videoId: string): Promise<DislikeAnalysis> {
  // 1. Fetch video metadata
  const video = await getVideoData(videoId);

  // 2. Fetch dislike metrics from Return YouTube Dislike API
  const cacheKey = `dislikes:${videoId}`;
  let rydData = appCache.get<{
    id: string;
    likes?: number;
    dislikes?: number;
    rating?: number;
    rawDislikes?: number;
    viewCount?: number;
  }>(cacheKey);

  if (!rydData) {
    try {
      const res = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${encodeURIComponent(videoId)}`, {
        headers: { 'User-Agent': COMMON_USER_AGENT },
        signal: AbortSignal.timeout(4500),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json.dislikes === 'number') {
          rydData = json;
          appCache.set(cacheKey, rydData, CACHE_TTL.VIDEO_MS);
        }
      }
    } catch (err) {
      console.warn('Return YouTube Dislike API request failed or timed out:', err);
    }
  }

  // Calculate numbers accurately
  const likes = typeof rydData?.likes === 'number' ? rydData.likes : (video.likeCount ?? 0);
  const dislikes = typeof rydData?.dislikes === 'number' ? rydData.dislikes : 0;
  const totalVotes = likes + dislikes;

  const approvalRating = totalVotes > 0 ? Number(((likes / totalVotes) * 100).toFixed(1)) : 100;
  const dislikeRatio = totalVotes > 0 ? Number(((dislikes / totalVotes) * 100).toFixed(1)) : 0;

  const rating =
    typeof rydData?.rating === 'number'
      ? Number(rydData.rating.toFixed(2))
      : Number(((approvalRating / 100) * 5).toFixed(2));

  const viewCount = (typeof rydData?.viewCount === 'number' && rydData.viewCount > 0)
    ? rydData.viewCount
    : video.viewCount;

  const dislikesPer1kViews =
    viewCount && viewCount > 0 && dislikes > 0
      ? Number(((dislikes / viewCount) * 1000).toFixed(2))
      : 0;

  let sentiment: DislikeAnalysis['sentiment'] = 'Mostly Positive';
  if (approvalRating >= 95) {
    sentiment = 'Overwhelmingly Positive';
  } else if (approvalRating >= 85) {
    sentiment = 'Mostly Positive';
  } else if (approvalRating >= 70) {
    sentiment = 'Mixed Sentiment';
  } else {
    sentiment = 'High Dislike Ratio';
  }

  const thumb =
    video.thumbnails.maxres ||
    video.thumbnails.standard ||
    video.thumbnails.high ||
    video.thumbnails.medium ||
    video.thumbnails.default ||
    '';

  return {
    videoId,
    video: {
      id: video.id,
      title: video.title,
      channelTitle: video.channelTitle,
      channelId: video.channelId,
      thumbnail: thumb,
      viewCount,
      publishedAt: video.publishedAt,
      duration: video.duration,
    },
    likes,
    dislikes,
    totalVotes,
    approvalRating,
    dislikeRatio,
    rating,
    dislikesPer1kViews,
    sentiment,
    isEstimate: true,
    disclaimer:
      'YouTube officially made dislike counts private in December 2021. This estimate is calculated using public video telemetry and the Return YouTube Dislike community database.',
  };
}

