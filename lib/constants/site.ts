export const SITE_NAME = 'YT MONETIZE';
export const SITE_DOMAIN = 'youtubemonetizationchecker.online';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://youtubemonetizationchecker.online';

export type ToolBadgeType = 'MOST POPULAR' | 'POPULAR' | 'NEW';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  path: string;
  description: string;
  category: 'Monetization' | 'Channel' | 'Video' | 'Analytics';
  icon: string;
  featured?: boolean;
  badge?: ToolBadgeType;
}

export const TOOLS: ToolItem[] = [
  {
    id: 'monetization-checker',
    name: 'YouTube Monetization Checker',
    slug: 'monetization-checker',
    path: '/monetization-checker',
    description: 'Check publicly observable monetization signals and ad metrics for any YouTube channel or video.',
    category: 'Monetization',
    icon: 'DollarSign',
    featured: true,
    badge: 'MOST POPULAR',
  },
  {
    id: 'channel-id-finder',
    name: 'YouTube Channel ID Finder',
    slug: 'channel-id-finder',
    path: '/channel-id-finder',
    description: 'Find and copy canonical 24-character YouTube channel IDs from URLs, handles, and video links.',
    category: 'Channel',
    icon: 'Search',
    featured: true,
    badge: 'POPULAR',
  },
  {
    id: 'earnings-calculator',
    name: 'YouTube Earnings Calculator',
    slug: 'earnings-calculator',
    path: '/earnings-calculator',
    description: 'Estimate realistic YouTube revenue based on daily/monthly views, CPM/RPM metrics, and audience geography.',
    category: 'Analytics',
    icon: 'Calculator',
    featured: true,
    badge: 'POPULAR',
  },
  {
    id: 'thumbnail-downloader',
    name: 'YouTube Thumbnail Downloader',
    slug: 'thumbnail-downloader',
    path: '/thumbnail-downloader',
    description: 'Extract and download original high-resolution YouTube video thumbnails in HD 1080p, HQ, and standard formats.',
    category: 'Video',
    icon: 'Image',
    featured: true,
    badge: 'POPULAR',
  },
  {
    id: 'image-downloader',
    name: 'YouTube Image Downloader',
    slug: 'image-downloader',
    path: '/image-downloader',
    description: 'Download full-resolution channel avatars (800x800) and channel banner artwork (2560x1440) directly.',
    category: 'Channel',
    icon: 'Download',
    featured: true,
  },
  {
    id: 'tag-extractor',
    name: 'YouTube Tag Extractor',
    slug: 'tag-extractor',
    path: '/tag-extractor',
    description: 'Extract, inspect, and copy all hidden SEO tags, topic keywords, and metadata from public YouTube videos.',
    category: 'Video',
    icon: 'Tag',
    featured: true,
  },
  {
    id: 'shadowban-detector',
    name: 'YouTube Shadowban Detector',
    slug: 'shadowban-detector',
    path: '/shadowban-detector',
    description: 'Run diagnostic health checks on public search indexing, video visibility, and recommendation status.',
    category: 'Analytics',
    icon: 'ShieldAlert',
    featured: true,
  },
  {
    id: 'data-viewer',
    name: 'YouTube Data Viewer',
    slug: 'data-viewer',
    path: '/data-viewer',
    description: 'Inspect normalized structured metadata, video specs, tags, timestamps, and channel telemetry in one view.',
    category: 'Video',
    icon: 'BarChart2',
    featured: true,
  },
  {
    id: 'comment-viewer',
    name: 'YouTube Comment Viewer',
    slug: 'comment-viewer',
    path: '/comment-viewer',
    description: 'View, search, filter, and pick comments from any YouTube video with like counts, replies, and export options.',
    category: 'Video',
    icon: 'MessageSquare',
    featured: true,
  },
  {
    id: 'random-comment-picker',
    name: 'YouTube Random Comment Picker',
    slug: 'random-comment-picker',
    path: '/random-comment-picker',
    description: 'Fair and unbiased giveaway winner picker for YouTube videos. Filter duplicate users, search keywords, and draw winners instantly.',
    category: 'Video',
    icon: 'Trophy',
    featured: true,
    badge: 'NEW',
  },
  {
    id: 'dislike-checker',
    name: 'YouTube Dislike & Sentiment Checker',
    slug: 'dislike-checker',
    path: '/dislike-checker',
    description: 'Check hidden YouTube dislikes, like-to-dislike ratio, approval rating percentage, and audience sentiment for any video.',
    category: 'Video',
    icon: 'ThumbsDown',
    featured: true,
    badge: 'NEW',
  },
  {
    id: 'description-viewer',
    name: 'YouTube Description Extractor & Viewer',
    slug: 'description-viewer',
    path: '/description-viewer',
    description: 'View, extract, and copy full YouTube video descriptions. Discover timestamps, chapters, external links, hashtags, and word counts.',
    category: 'Video',
    icon: 'FileText',
    featured: true,
  },
  {
    id: 'private-viewer',
    name: 'Private YouTube Viewer (Anonymous Mode)',
    slug: 'private-viewer',
    path: '/private-viewer',
    description: 'Watch YouTube videos privately and anonymously without tracking cookies, Google account watch history, or distracting algorithm feeds.',
    category: 'Video',
    icon: 'EyeOff',
    featured: true,
    badge: 'NEW',
  },
  {
    id: 'hidden-video-finder',
    name: 'YouTube Unlisted & Hidden Video Finder',
    slug: 'hidden-video-finder',
    path: '/hidden-video-finder',
    description: 'Scan any YouTube channel or playlist to discover unlisted videos, hidden playlist items, and detect locked private video slots.',
    category: 'Channel',
    icon: 'FolderSearch',
    featured: true,
    badge: 'NEW',
  },
];

export const RELATED_TOOLS_MAP: Record<string, string[]> = {
  'monetization-checker': ['channel-id-finder', 'earnings-calculator', 'data-viewer'],
  'channel-id-finder': ['monetization-checker', 'image-downloader', 'data-viewer'],
  'earnings-calculator': ['monetization-checker', 'data-viewer', 'channel-id-finder'],
  'thumbnail-downloader': ['private-viewer', 'description-viewer', 'data-viewer'],
  'image-downloader': ['thumbnail-downloader', 'channel-id-finder', 'monetization-checker'],
  'tag-extractor': ['description-viewer', 'dislike-checker', 'data-viewer'],
  'shadowban-detector': ['monetization-checker', 'data-viewer', 'channel-id-finder'],
  'data-viewer': ['private-viewer', 'description-viewer', 'tag-extractor'],
  'comment-viewer': ['private-viewer', 'description-viewer', 'random-comment-picker'],
  'random-comment-picker': ['comment-viewer', 'dislike-checker', 'description-viewer'],
  'dislike-checker': ['private-viewer', 'description-viewer', 'comment-viewer'],
  'description-viewer': ['private-viewer', 'tag-extractor', 'thumbnail-downloader'],
  'private-viewer': ['hidden-video-finder', 'description-viewer', 'data-viewer'],
  'hidden-video-finder': ['private-viewer', 'data-viewer', 'channel-id-finder'],
};
