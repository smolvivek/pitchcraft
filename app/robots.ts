import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pitchcraft.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login', '/signup', '/reset-password', '/update-password'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
