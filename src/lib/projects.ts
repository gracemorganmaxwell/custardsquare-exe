import configPromise from '@payload-config'
import { getPayload } from 'payload'

import {
  bundledProjectIcon,
  DEFAULT_PROJECTS,
  type ProjectItem,
} from '@/lib/default-projects'
import { resolveMedia, resolveMediaUrl } from '@/lib/resolve-media'

export async function getPublishedProjects(): Promise<ProjectItem[]> {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 100,
    sort: 'sortOrder',
    where: {
      published: {
        equals: true,
      },
    },
  })

  if (docs.length === 0) {
    return DEFAULT_PROJECTS
  }

  return docs
    .map((doc) => {
      const url = doc.url.trim()
      const icon = resolveMedia(doc.icon)

      return {
        title: doc.title.trim(),
        url,
        summary: doc.summary.trim(),
        story: doc.story?.trim() || '',
        iconSrc: resolveMediaUrl(icon) ?? bundledProjectIcon(url),
      }
    })
    .filter((entry) => entry.title.length > 0 && entry.url.length > 0 && entry.summary.length > 0)
}
