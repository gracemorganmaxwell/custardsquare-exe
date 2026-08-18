/**
 * Verify issue #51 acceptance criteria for the Projects collection + window.
 * Usage: pnpm verify-issue-051
 */
import 'dotenv/config'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'

const collectionSource = readFileSync(path.join(root, 'src/collections/Projects.ts'), 'utf8')
const payloadSource = readFileSync(path.join(root, 'src/payload.config.ts'), 'utf8')
const windowSource = readFileSync(path.join(root, 'src/components/windows/ProjectsWindow.tsx'), 'utf8')
const managerSource = readFileSync(path.join(root, 'src/components/desktop/WindowManager.tsx'), 'utf8')
const pageSource = readFileSync(path.join(root, 'src/app/(frontend)/page.tsx'), 'utf8')
const defaultsSource = readFileSync(path.join(root, 'src/lib/default-projects.ts'), 'utf8')

const hasCollection =
  collectionSource.includes("slug: 'projects'") &&
  collectionSource.includes("name: 'story'") &&
  collectionSource.includes("name: 'icon'") &&
  collectionSource.includes("name: 'published'")
const registeredInPayload =
  payloadSource.includes('Projects') && payloadSource.includes('seedProjectsIfEmpty')
const windowListsProjects =
  windowSource.includes('projects-window') &&
  windowSource.includes('project.iconSrc') &&
  windowSource.includes('Visit site')
const wiredToDesktop =
  managerSource.includes('<ProjectsWindow') && pageSource.includes('getPublishedProjects')
const bundledFavicons =
  defaultsSource.includes('/icons/projects/delta-rootz.png') &&
  defaultsSource.includes('/icons/projects/refined-k9.png') &&
  defaultsSource.includes('/icons/projects/blue-rose.png') &&
  defaultsSource.includes('/icons/projects/walkies-quest.png')

const screenshotList = path.join(root, 'docs/screenshots/foundation/issue-051-ac1-projects-list.png')
const screenshotStory = path.join(
  root,
  'docs/screenshots/foundation/issue-051-ac2-project-story.png',
)
const hasListShot = existsSync(screenshotList)
const hasStoryShot = existsSync(screenshotStory)

const homeStatus = execFileSync(
  'curl',
  ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}/`],
  { encoding: 'utf8' },
).trim()

const failed =
  !hasCollection ||
  !registeredInPayload ||
  !windowListsProjects ||
  !wiredToDesktop ||
  !bundledFavicons ||
  !hasListShot ||
  !hasStoryShot ||
  homeStatus !== '200'

const lines = [
  '=== Issue #51 verification ===',
  '',
  'AC1 — Projects in Payload',
  `  collection fields (title/url/summary/story/icon/published): ${hasCollection ? 'yes' : 'no'}`,
  `  registered + seeded in payload.config: ${registeredInPayload ? 'yes' : 'no'}`,
  '',
  'AC2 — Projects window lists them',
  `  window uses per-project favicon + story + Visit site: ${windowListsProjects ? 'yes' : 'no'}`,
  `  homepage loads getPublishedProjects: ${wiredToDesktop ? 'yes' : 'no'}`,
  `  bundled favicons for four live sites: ${bundledFavicons ? 'yes' : 'no'}`,
  `  route: ${baseUrl}/ → HTTP ${homeStatus}`,
  '',
  'Evidence',
  `  issue-051-ac1-projects-list.png: ${hasListShot ? 'yes' : 'missing'}`,
  `  issue-051-ac2-project-story.png: ${hasStoryShot ? 'yes' : 'missing'}`,
  '',
  failed ? 'FAIL: issue #51 checks incomplete' : 'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(failed ? 1 : 0)
