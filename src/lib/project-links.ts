export type ProjectLink = {
  id: string
  label: string
  url: string
  blurb: string
}

export const PROJECT_LINKS: ProjectLink[] = [
  {
    id: 'rain-check',
    label: 'rain check',
    url: 'https://www.walkies.quest',
    blurb:
      'Personal NZ rain map for dog walkies — sampled suburbs across Christchurch, Auckland, Wellington, and Dunedin show dry vs raining right now (Flask API + React / Tailwind / Leaflet).',
  },
  {
    id: 'refined-k9',
    label: 'Refined K-9',
    url: 'https://www.refinedk9doggrooming.co.nz',
    blurb:
      'Real-client Christchurch mobile dog grooming site migrated off WordPress/Elementor (iframe booking was blocked with 403s) onto a React + TypeScript + Vite landing page on Cloudflare, with Savvy Pet Spa booking embedded.',
  },
  {
    id: 'blue-rose-nails',
    label: 'Blue Rose Nails',
    url: 'https://www.bluerosenailsandbeauty.co.nz',
    blurb:
      'Real-client nails and beauty site built with RedwoodJS (React + GraphQL) on Vercel — Supabase for contact form submissions, Cloudinary for media, Tailwind UI, and Fresha treatment booking links.',
  },
]
