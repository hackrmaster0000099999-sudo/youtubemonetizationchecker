import { MetadataRoute } from 'next';
import { SITE_URL, TOOLS } from '@/lib/constants/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/faq',
    '/privacy-policy',
    '/terms-of-use',
    '/contact',
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : 0.6,
  }));

  const toolEntries: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: tool.id === 'monetization-checker' ? 0.9 : 0.8,
  }));

  return [...staticEntries, ...toolEntries];
}
