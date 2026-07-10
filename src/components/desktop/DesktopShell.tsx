import { AdminFooterLink } from '@/components/desktop/AdminFooterLink'
import { DesktopIconGrid } from '@/components/desktop/DesktopIconGrid'

type DesktopShellProps = {
  children: React.ReactNode
}

export function DesktopShell({ children }: DesktopShellProps) {
  return (
    <div className="desktop-shell">
      <div aria-hidden="true" className="desktop-shell__wallpaper">
        {/* Decorative pixel asset — avoid next/image softening */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="desktop-shell__wallpaper-flag"
          height={100}
          src="/brand/desktop-background.png"
          width={100}
        />
      </div>
      <section aria-label="Desktop icons" className="desktop-shell__icons">
        <DesktopIconGrid />
      </section>
      <div className="desktop-shell__windows">{children}</div>
      <AdminFooterLink />
    </div>
  )
}
