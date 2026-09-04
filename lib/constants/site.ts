export const SITE_NAME = 'YT MONETIZE';
export const SITE_DOMAIN = 'youtubemonetizationchecker.online';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://youtubemonetizationchecker.online';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  path: string;
  description: string;
  category: 'Monetization' | 'Channel' | 'Video' | 'Analytics';
  icon: string;
  featured?: boolean;
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
    name: 'YouTube Metadata Viewer',
    slug: 'data-viewer',
    path: '/data-viewer',
    description: 'Inspect normalized structured metadata, video specs, tags, timestamps, and channel telemetry in one view.',
    category: 'Video',
    icon: 'BarChart2',
    featured: true,
  },
];

export const RELATED_TOOLS_MAP: Record<string, string[]> = {
  'monetization-checker': ['channel-id-finder', 'earnings-calculator', 'data-viewer'],
  'channel-id-finder': ['monetization-checker', 'image-downloader', 'data-viewer'],
  'earnings-calculator': ['monetization-checker', 'data-viewer', 'channel-id-finder'],
  'thumbnail-downloader': ['image-downloader', 'tag-extractor', 'data-viewer'],
  'image-downloader': ['thumbnail-downloader', 'channel-id-finder', 'monetization-checker'],
  'tag-extractor': ['data-viewer', 'thumbnail-downloader', 'monetization-checker'],
  'shadowban-detector': ['monetization-checker', 'data-viewer', 'channel-id-finder'],
  'data-viewer': ['monetization-checker', 'tag-extractor', 'thumbnail-downloader'],
};

