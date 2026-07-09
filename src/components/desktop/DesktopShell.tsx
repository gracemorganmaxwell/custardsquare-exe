import { AdminFooterLink } from '@/components/desktop/AdminFooterLink'

type DesktopShellProps = {
  children: React.ReactNode
}

export function DesktopShell({ children }: DesktopShellProps) {
  return (
    <div className="desktop-shell">
      <div aria-hidden="true" className="desktop-shell__wallpaper" />
      <section aria-label="Desktop icons" className="desktop-shell__icons" />
      <div className="desktop-shell__windows">{children}</div>
      <AdminFooterLink />
    </div>
  )
}
