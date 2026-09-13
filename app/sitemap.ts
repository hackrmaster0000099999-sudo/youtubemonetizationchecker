import { MetadataRoute } from 'next';
import { SITE_URL, TOOLS } from '@/lib/constants/site';
import { CAPTION_CATEGORIES } from '@/lib/constants/captions';

// Generates separate individual sitemaps for each category option and main tools
export async function generateSitemaps() {
  return [
    { id: 'main' },
    { id: 'tools' },
    ...CAPTION_CATEGORIES.map((cat) => ({ id: cat.id })),
  ];
}

export default async function sitemap({
  id,
}: {
  id: Promise<string> | string;
}): Promise<MetadataRoute.Sitemap> {
  const resolvedId = typeof id === 'object' && 'then' in id ? await id : id;

  // 1. Category-specific sitemaps: Each category has its own separate sitemap
  const category = CAPTION_CATEGORIES.find((c) => c.id === resolvedId);
  if (category) {
    return [
      {
        url: `${SITE_URL}/captions/${category.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ];
  }

  // 2. Tools sitemap
  if (resolvedId === 'tools') {
    return TOOLS.map((tool) => ({
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
  }

  // 3. Main static pages sitemap (id === 'main' or fallback)
  return [
    { url: `${SITE_URL}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/captions`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/terms-of-use`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
}

