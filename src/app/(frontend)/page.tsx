import { BootScreen } from '@/components/desktop/BootScreen'
import { DesktopExperience } from '@/components/desktop/DesktopExperience'
import { getPublishedArticles } from '@/lib/articles'
import { getSiteSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

const FALLBACK_SOCIAL_LINKS = [
  {
    label: 'GitHub',
    url: 'https://github.com/gracemorganmaxwell/custardsquare-exe',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/graciemorgan-maxwell/',
  },
]

export default async function HomePage() {
  const [settings, publishedArticles] = await Promise.all([
    getSiteSettings(),
    getPublishedArticles(),
  ])
  const socialLinks =
    settings.socialLinks.length > 0 ? settings.socialLinks : FALLBACK_SOCIAL_LINKS
  const articles = publishedArticles.map((article) => ({
    slug: article.slug,
    title: article.title,
  }))

  return (
    <BootScreen siteTitle={settings.siteTitle}>
      <DesktopExperience
        about={settings.about}
        articles={articles}
        resume={settings.resume}
        siteDescription={settings.siteDescription}
        siteTitle={settings.siteTitle}
        socialLinks={socialLinks}
      />
    </BootScreen>
  )
}
