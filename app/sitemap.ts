import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pitchcraft.app'

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Fetch public pitch links (only public, not private or password-protected)
  const supabase = createAdminClient()
  const { data: publicLinks } = await supabase
    .from('share_links')
    .select('pitch_id, updated_at')
    .eq('visibility', 'public')
    .is('deleted_at', null)

  const pitchPages: MetadataRoute.Sitemap = (publicLinks ?? []).map((link) => ({
    url: `${siteUrl}/p/${link.pitch_id}`,
    lastModified: new Date(link.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...pitchPages]
}
