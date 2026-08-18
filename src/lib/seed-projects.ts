import type { Payload } from 'payload'

import { DEFAULT_PROJECTS } from '@/lib/default-projects'

export async function seedProjectsIfEmpty(payload: Payload) {
  const existing = await payload.count({ collection: 'projects' })
  if (existing.totalDocs > 0) {
    return
  }

  for (const [index, project] of DEFAULT_PROJECTS.entries()) {
    await payload.create({
      collection: 'projects',
      data: {
        title: project.title,
        url: project.url,
        summary: project.summary,
        story: project.story,
        sortOrder: (index + 1) * 10,
        published: true,
      },
    })
  }
}
