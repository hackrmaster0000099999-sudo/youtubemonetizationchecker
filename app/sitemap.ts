import { MetadataRoute } from 'next';
import { SITE_URL, TOOLS } from '@/lib/constants/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/faq', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/privacy-policy', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/terms-of-use', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const toolEntries: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority:
      tool.id === 'monetization-checker'
        ? 0.95
        : tool.badge === 'MOST POPULAR' || tool.badge === 'POPULAR'
        ? 0.9
        : 0.85,
  }));

  return [...staticEntries, ...toolEntries];
}
