import { MetadataRoute } from 'next';
import { SITE_URL, TOOLS } from '@/lib/constants/site';
import { CAPTION_CATEGORIES } from '@/lib/constants/captions';

export default function sitemap(): MetadataRoute.Sitemap {
  const toolsUrls: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority:
      tool.id === 'monetization-checker'
        ? 0.95
        : tool.badge === 'MOST POPULAR' || tool.badge === 'POPULAR'
        ? 0.9
        : 0.85,
  }));

  const categoryUrls: MetadataRoute.Sitemap = CAPTION_CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/captions/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  const mainPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/captions`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/terms-of-use`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  return [...mainPages, ...toolsUrls, ...categoryUrls];
}

