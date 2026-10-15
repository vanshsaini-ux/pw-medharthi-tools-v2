import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.pwmedharthi.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/career-intelligence',
    '/career-fit-finder',
    '/career-roi-calculator',
    '/skill-gap-analyzer',
    '/career-roadmap-generator',
    '/eligibility-checker'
  ];
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8
  }));
}
