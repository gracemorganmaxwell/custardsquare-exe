export type ProjectItem = {
  iconSrc: string
  story: string
  summary: string
  title: string
  url: string
}

export const FALLBACK_PROJECT_ICON = '/icons/desktop/projects.png'

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    title: 'Delta Rootz Rock Radio',
    url: 'https://www.dtripler.com/',
    summary: 'Live independent rock radio station; eclectic streaming, listen live.',
    iconSrc: '/icons/projects/delta-rootz.png',
    story:
      'Delta Rootz is a live independent rock station — eclectic, unfiltered, and built for people who still believe radio can be a bit wild.\n\nI made the public site so listeners can tune in, see what is playing, and meet the crew. Not a playlist by committee. A station with a pulse, and a homepage that had to feel like that.',
  },
  {
    title: 'Refined K-9 Mobile Dog Grooming',
    url: 'https://refinedk9doggrooming.co.nz/',
    summary: 'Christchurch mobile dog grooming site with online booking.',
    iconSrc: '/icons/projects/refined-k9.png',
    story:
      'Tyla runs a mobile dog grooming round in Christchurch. She needed a real site, not a Facebook page pretending to be a shopfront.\n\nI built the landing page and wired in booking so people can get their dog on the van calendar without a phone-tag. Calm, friendly, chemical-free grooming — the site had to match how she actually treats the dogs.',
  },
  {
    title: 'Blue Rose Nails and Beauty',
    url: 'https://bluerosenailsandbeauty.co.nz/',
    summary: 'Christchurch nails and beauty salon site.',
    iconSrc: '/icons/projects/blue-rose.png',
    story:
      "Blue Rose is Anna's nails and beauty studio in Hornby. Local, personal, the kind of place people come back to.\n\nThis was a small-business website for a real client: find the salon, trust the room, book a treatment. Shipping something a working therapist can actually use taught me more than another demo ever would.",
  },
  {
    title: 'Walkies Quest',
    url: 'https://walkies.quest/',
    summary: 'NZ rain map for dog walkies: dry vs raining suburb samples.',
    iconSrc: '/icons/projects/walkies-quest.png',
    story:
      'Walkies Quest started as a selfish question: is this suburb dry enough to take the dogs out?\n\nIt is a New Zealand rain map — dry versus raining samples — so you can plan a walk before anyone gets soaked. A tiny quest with a real domain.',
  },
]

export function bundledProjectIcon(url: string): string {
  return DEFAULT_PROJECTS.find((project) => project.url === url)?.iconSrc ?? FALLBACK_PROJECT_ICON
}
