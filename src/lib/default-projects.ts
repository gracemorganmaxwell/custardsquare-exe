export type ProjectItem = {
  summary: string
  title: string
  url: string
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    title: 'Delta Rootz Rock Radio',
    url: 'https://www.dtripler.com/',
    summary: 'Live independent rock radio station; eclectic streaming, listen live.',
  },
  {
    title: 'Refined K-9 Mobile Dog Grooming',
    url: 'https://refinedk9doggrooming.co.nz/',
    summary: 'Christchurch mobile dog grooming site with online booking.',
  },
  {
    title: 'Blue Rose Nails and Beauty',
    url: 'https://bluerosenailsandbeauty.co.nz/',
    summary: 'Christchurch nails and beauty salon site.',
  },
  {
    title: 'Walkies Quest',
    url: 'https://walkies.quest/',
    summary: 'NZ rain map for dog walkies: dry vs raining suburb samples.',
  },
]
