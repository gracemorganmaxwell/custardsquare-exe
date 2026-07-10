import { BootScreen } from '@/components/desktop/BootScreen'
import { DesktopShell } from '@/components/desktop/DesktopShell'
import { LoginScreen } from '@/components/desktop/LoginScreen'
import { WelcomeWindow } from '@/components/desktop/WelcomeWindow'
import { getSiteSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

const FALLBACK_SOCIAL_LINKS = [
  {
    label: 'GitHub',
    url: 'https://github.com/gracemorganmaxwell/custardsquare-exe',
  },
]

export default async function HomePage() {
  const settings = await getSiteSettings()
  const socialLinks =
    settings.socialLinks.length > 0 ? settings.socialLinks : FALLBACK_SOCIAL_LINKS

  return (
    <BootScreen siteTitle={settings.siteTitle}>
      <LoginScreen siteTitle={settings.siteTitle}>
        <DesktopShell>
          <WelcomeWindow
            siteDescription={settings.siteDescription}
            siteTitle={settings.siteTitle}
            socialLinks={socialLinks}
          />
        </DesktopShell>
      </LoginScreen>
    </BootScreen>
  )
}
