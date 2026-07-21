import { DesktopExperience } from '@/components/desktop/DesktopExperience'
import { getPublishedArticles } from '@/lib/articles'
import { getSiteSettings } from '@/lib/site-settings'
import { GITHUB_LINK, LINKEDIN_LINK } from '@/lib/social-links'

export const dynamic = 'force-dynamic'

const FALLBACK_SOCIAL_LINKS = [GITHUB_LINK, LINKEDIN_LINK]

export default async function HomePage() {
  const [settings, publishedArticles] = await Promise.all([
    getSiteSettings(),
    getPublishedArticles(),
  ])
  const socialLinks =
    settings.socialLinks.length > 0 ? settings.socialLinks : FALLBACK_SOCIAL_LINKS
  const articles = publishedArticles.map((article) => ({
    excerpt: article.excerpt,
    slug: article.slug,
    title: article.title,
  }))

  return (
    <DesktopExperience
      about={settings.about}
      articles={articles}
      credits={settings.credits}
      resume={settings.resume}
      siteDescription={settings.siteDescription}
      siteTitle={settings.siteTitle}
      skills={settings.skills}
      socialLinks={socialLinks}
    />
  )
}
