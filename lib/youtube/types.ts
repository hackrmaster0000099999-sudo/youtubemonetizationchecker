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
