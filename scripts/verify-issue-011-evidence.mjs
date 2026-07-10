/**
 * Verify issue #11 — Credits collection cancelled; folded into SiteSettings (#10).
 * Usage: pnpm verify-issue-011
 */
import 'dotenv/config'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { getSiteSettings } from '../src/lib/site-settings.ts'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const siteSettingsSource = readFileSync(path.join(root, 'src/globals/SiteSettings.ts'), 'utf8')
const payloadConfigSource = readFileSync(path.join(root, 'src/payload.config.ts'), 'utf8')
const issueManifest = readFileSync(
  path.join(root, 'docs/issues/011-credits-collection.md'),
  'utf8',
)

const creditsCollectionPath = path.join(root, 'src/collections/Credits.ts')
const noSeparateCollection = !existsSync(creditsCollectionPath)
const payloadHasNoCreditsCollection = !payloadConfigSource.includes('Credits')
const creditsFieldInSiteSettings =
  siteSettingsSource.includes("name: 'credits'") &&
  siteSettingsSource.includes("type: 'textarea'")
const manifestDocumentsCancellation =
  issueManifest.includes('Cancelled') && issueManifest.includes('#10')

const testCredits =
  'Icons by aconfuseddragon (itch.io) — issue #11 evidence (temporary)'

const payload = await getPayload({ config: await config })

const previous = await payload.findGlobal({
  slug: 'site-settings',
  overrideAccess: true,
})

const updated = await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    credits: testCredits,
  },
  overrideAccess: true,
})

const frontendSettings = await getSiteSettings()

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    credits: previous.credits ?? '',
  },
  overrideAccess: true,
})

const adminCanEditCredits = updated.credits === testCredits
const frontendReadsCredits = frontendSettings.credits === testCredits

if (
  !noSeparateCollection ||
  !payloadHasNoCreditsCollection ||
  !creditsFieldInSiteSettings ||
  !manifestDocumentsCancellation
) {
  console.error('FAIL: Credits collection cancellation or SiteSettings fold incomplete')
  process.exit(1)
}

if (!adminCanEditCredits || !frontendReadsCredits) {
  console.error('FAIL: credits not editable/readable via SiteSettings')
  console.error({ adminCanEditCredits, frontendReadsCredits })
  process.exit(1)
}

const lines = [
  '=== Issue #11 verification ===',
  '',
  'Decision — Cancelled separate Credits collection',
  `  src/collections/Credits.ts exists: no`,
  `  Credits in payload.config collections: no`,
  `  docs/issues/011 documents fold into #10: yes`,
  '',
  'AC — Folded into #10 SiteSettings',
  `  SiteSettings credits textarea: ${creditsFieldInSiteSettings ? 'yes' : 'no'}`,
  `  admin updateGlobal credits: ${adminCanEditCredits ? 'yes' : 'no'}`,
  `  frontend getSiteSettings().credits: "${frontendSettings.credits}"`,
  `  note: typed credit entries + display order deferred; simple textarea for MVP`,
  `  Credits window UI: deferred to #35`,
  '',
  'ALL CHECKS PASSED',
]

console.log(lines.join('\n'))
process.exit(0)
