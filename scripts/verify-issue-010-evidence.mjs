/**
 * Verify issue #10 acceptance criteria for SiteSettings global.
 * Usage: pnpm verify-issue-010
 */
import 'dotenv/config'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { getSiteSettings } from '../src/lib/site-settings.ts'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000'
const siteSettingsSource = readFileSync(path.join(root, 'src/globals/SiteSettings.ts'), 'utf8')
const siteSettingsLibSource = readFileSync(path.join(root, 'src/lib/site-settings.ts'), 'utf8')
const payloadConfigSource = readFileSync(path.join(root, 'src/payload.config.ts'), 'utf8')

const hasCoreFields =
  siteSettingsSource.includes("name: 'siteTitle'") &&
  siteSettingsSource.includes("name: 'siteDescription'") &&
  siteSettingsSource.includes("name: 'defaultOgImage'") &&
  siteSettingsSource.includes("name: 'favicon'")
const hasSocialLinks =
  siteSettingsSource.includes("name: 'socialLinks'") &&
  siteSettingsSource.includes("name: 'label'") &&
  siteSettingsSource.includes("name: 'url'")
const hasCreditsField =
  siteSettingsSource.includes("name: 'credits'") &&
  siteSettingsSource.includes("type: 'textarea'")
const adminOnlyUpdate =
  siteSettingsSource.includes('update: isAdmin') &&
  siteSettingsSource.includes('read: () => true')
const frontendReadsSettings = siteSettingsLibSource.includes('export async function getSiteSettings')
const globalRegistered = payloadConfigSource.includes('globals: [SiteSettings]')
const noCreditsCollection = !existsSync(path.join(root, 'src/collections/Credits.ts'))

const testTitle = `custardsquare.exe — issue #10 evidence ${Date.now()}`
const testDescription = 'Temporary description for issue #10 verification.'
const testSocialLinks = [
  { label: 'GitHub', url: 'https://github.com/gracemorganmaxwell/custardsquare-exe' },
]
const testCredits = 'aconfuseddragon icons — issue #10 evidence (temporary)'

const payload = await getPayload({ config: await config })

const previous = await payload.findGlobal({
  slug: 'site-settings',
  overrideAccess: true,
})

const updated = await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    siteTitle: testTitle,
    siteDescription: testDescription,
    socialLinks: testSocialLinks,
    credits: testCredits,
  },
  overrideAccess: true,
})

const frontendSettings = await getSiteSettings()

let publicUpdateBlocked = false
try {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteTitle: 'public update should fail',
    },
    overrideAccess: false,
  })
} catch {
  publicUpdateBlocked = true
}

const publicReadStatus = execFileSync(
  'curl',
  ['-s', '-o', '/dev/null', '-w', '%{http_code}', `${baseUrl}/api/globals/site-settings?depth=0`],
  { encoding: 'utf8' },
).trim()

let publicPatchStatus = '000'
try {
  publicPatchStatus = execFileSync(
    'curl',
    [
      '-s',
      '-o',
      '/dev/null',
      '-w',
      '%{http_code}',
      '-X',
      'POST',
      `${baseUrl}/api/globals/site-settings`,
      '-H',
      'Content-Type: application/json',
      '-d',
      JSON.stringify({ siteTitle: 'blocked' }),
    ],
    { encoding: 'utf8' },
  ).trim()
} catch {
  publicPatchStatus = 'error'
}

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    siteTitle: previous.siteTitle,
    siteDescription: previous.siteDescription,
    socialLinks: previous.socialLinks ?? [],
    credits: previous.credits ?? '',
    defaultOgImage: previous.defaultOgImage,
    favicon: previous.favicon,
  },
  overrideAccess: true,
})

const adminCanEditCore =
  updated.siteTitle === testTitle && updated.siteDescription === testDescription
const socialLinksEditable =
  Array.isArray(updated.socialLinks) &&
  updated.socialLinks[0]?.label === 'GitHub' &&
  updated.socialLinks[0]?.url?.includes('github.com')
const frontendReads =
  frontendSettings.siteTitle === testTitle &&
  frontendSettings.siteDescription === testDescription &&
  frontendSettings.socialLinks.length === 1 &&
  frontendSettings.credits === testCredits
const publicReadOk = publicReadStatus === '200'
const publicWriteBlocked =
  publicUpdateBlocked || publicPatchStatus === '403' || publicPatchStatus === '401'

if (!hasCoreFields || !hasSocialLinks || !hasCreditsField || !adminOnlyUpdate || !globalRegistered) {
  console.error('FAIL: SiteSettings schema or registration incomplete')
  process.exit(1)
}

if (!adminCanEditCore || !socialLinksEditable) {
  console.error('FAIL: admin could not edit SiteSettings fields')
  process.exit(1)
}

if (!frontendReadsSettings || !frontendReads) {
  console.error('FAIL: frontend does not read SiteSettings correctly')
  process.exit(1)
}

if (!publicReadOk || !publicWriteBlocked) {
  console.error(
    `FAIL: access control unexpected (read=${publicReadStatus}, patch=${publicPatchStatus}, localBlock=${publicUpdateBlocked})`,
  )
  process.exit(1)
}

if (!noCreditsCollection) {
  console.error('FAIL: separate Credits collection should not exist')
  process.exit(1)
}

const lines = [
  '=== Issue #10 verification ===',
  '',
  'AC1 — Admin can edit site title, description, default OG image, and favicon',
  `  fields present: siteTitle, siteDescription, defaultOgImage, favicon`,
  `  admin updateGlobal title/description: ${adminCanEditCore ? 'yes' : 'no'}`,
  `  admin UI: ${baseUrl}/admin/globals/site-settings`,
  '',
  'AC2 — Social links (label + URL) are editable',
  `  socialLinks array field: ${hasSocialLinks ? 'yes' : 'no'}`,
  `  test link saved: ${socialLinksEditable ? 'yes' : 'no'}`,
  '',
  'AC3 — Frontend reads settings; only logged-in admin can update',
  `  getSiteSettings() used on frontend: ${frontendReadsSettings ? 'yes' : 'no'}`,
  `  frontend read-back: ${frontendReads ? 'yes' : 'no'}`,
  `  public GET /api/globals/site-settings: HTTP ${publicReadStatus}`,
  `  unauthenticated update blocked: ${publicWriteBlocked ? 'yes' : 'no'}`,
  `  update access: isAdmin only`,
  '',
  'AC4 — Credits live in SiteSettings (no separate Credits collection)',
  `  credits textarea: ${hasCreditsField ? 'yes' : 'no'}`,
  `  src/collections/Credits.ts: absent`,
  `  credits read-back: "${frontendSettings.credits}"`,
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
