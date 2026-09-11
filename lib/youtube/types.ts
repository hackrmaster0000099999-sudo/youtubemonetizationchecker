export type MonetizationStatus =
  | 'Likely Monetized'
  | 'Monetization Signals Detected'
  | 'No Clear Monetization Signals'
  | 'Unable to Determine';

export interface MonetizationSignal {
  name: string;
  detected: boolean;
  description: string;
}

export interface MonetizationAnalysis {
  status: MonetizationStatus;
  confidence: 'high' | 'medium' | 'low';
  signals: MonetizationSignal[];
  reason: string;
  disclaimer: string;
}

export interface ChannelData {
  id: string;
  title: string;
  handle: string;
  description: string;
  avatarUrl: string;
  bannerUrl?: string | null;
  subscriberCount: number | null;
  subscriberText: string;
  viewCount: number | null;
  viewCountText: string;
  videoCount: number | null;
  videoCountText: string;
  publishedAt: string | null;
  country: string | null;
  customUrl?: string;
  channelUrl: string;
  monetization: MonetizationAnalysis;
}

export interface VideoData {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string;
  channelHandle?: string;
  publishedAt: string | null;
  duration: string | null;
  durationSeconds: number | null;
  viewCount: number | null;
  viewCountText: string;
  likeCount: number | null;
  likeCountText: string;
  commentCount: number | null;
  category: string | null;
  tags: string[];
  description: string;
  thumbnails: {
    maxres?: string | null;
    standard?: string | null;
    high?: string | null;
    medium?: string | null;
    default?: string | null;
  };
  restrictions: {
    isAgeRestricted: boolean;
    madeForKids: boolean;
    regionRestricted: boolean;
  };
  monetization: MonetizationAnalysis;
}

export interface YouTubeComment {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  authorChannelUrl?: string;
  authorChannelId?: string;
  text: string;
  likeCount: number;
  publishedAt: string;
  replyCount: number;
  isPinned?: boolean;
}

export interface VideoCommentsResult {
  video: {
    id: string;
    title: string;
    channelTitle: string;
    channelId: string;
    thumbnail: string;
    commentCount: number | null;
    viewCount?: number | null;
    likeCount?: number | null;
    publishedAt?: string | null;
  };
  comments: YouTubeComment[];
  totalLoaded: number;
  nextPageToken?: string | null;
  commentsDisabled?: boolean;
}

export interface DislikeAnalysis {
  videoId: string;
  video: {
    id: string;
    title: string;
    channelTitle: string;
    channelId: string;
    thumbnail: string;
    viewCount: number | null;
    publishedAt: string | null;
    duration: string | null;
  };
  likes: number;
  dislikes: number;
  totalVotes: number;
  approvalRating: number;
  dislikeRatio: number;
  rating: number;
  dislikesPer1kViews: number;
  sentiment: 'Overwhelmingly Positive' | 'Mostly Positive' | 'Mixed Sentiment' | 'High Dislike Ratio';
  isEstimate: boolean;
  disclaimer: string;
}

export interface DescriptionAnalysis {
  type: 'VIDEO' | 'CHANNEL';
  id: string;
  title: string;
  author: string;
  channelId: string;
  thumbnail: string;
  description: string;
  viewCount?: number | null;
  publishedAt?: string | null;
  stats: {
    characters: number;
    words: number;
    lines: number;
    charLimitPercentage: number;
  };
  timestamps: Array<{ timestamp: string; label: string }>;
  links: Array<{ url: string; domain: string }>;
  hashtags: string[];
}

export interface DiscoveredVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string | null;
  playlistId: string;
  playlistTitle: string;
  privacyStatus: 'unlisted' | 'public' | 'private';
}

export interface HiddenVideoScanResult {
  targetType: 'CHANNEL' | 'PLAYLIST';
  targetInfo: {
    id: string;
    title: string;
    avatarOrThumb: string;
    author?: string;
    totalVideosHint?: number | null;
  };
  stats: {
    playlistsScanned: number;
    totalVideosScanned: number;
    unlistedCount: number;
    privateSlotsCount: number;
    publicCount: number;
  };
  unlistedVideos: DiscoveredVideo[];
  privateSlots: Array<{
    videoId: string;
    playlistId: string;
    playlistTitle: string;
    position?: number;
    note: string;
  }>;
  playlists: Array<{
    id: string;
    title: string;
    itemCount: number;
    thumbnail?: string;
    unlistedCount: number;
    privateCount: number;
  }>;
  explanation: string;
}

export type DownloadFormatType = 'video' | 'audio';

export interface VideoDownloadOption {
  id: string;
  label: string;
  resolution: string;
  quality: string;
  extension: 'mp4' | 'webm' | 'mp3' | 'm4a';
  type: DownloadFormatType;
  bitrateKbps: number;
  fps?: number;
  codec: string;
  hasAudio: boolean;
  hasVideo: boolean;
  sizeBytes: number;
  sizeFormatted: string;
  downloadUrl: string;
  note?: string;
  isPopular?: boolean;
}

export interface VideoDownloadResult {
  video: {
    id: string;
    title: string;
    channelTitle: string;
    channelId: string;
    thumbnail: string;
    duration: string;
    durationSeconds: number;
    viewCount?: number | null;
    viewCountText?: string;
    publishedAt?: string | null;
  };
  options: VideoDownloadOption[];
}


