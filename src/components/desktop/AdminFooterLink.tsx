import Link from 'next/link'

export function AdminFooterLink() {
  return (
    <p className="site-admin-footer">
      <Link href="/admin">/admin</Link>
    </p>
  )
}
