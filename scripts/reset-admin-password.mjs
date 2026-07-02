/**
 * Reset a Payload admin password locally.
 *
 * Usage (stop pnpm dev first):
 *   ADMIN_NEW_PASSWORD='your-new-password' pnpm reset-admin-password
 *
 * Optional:
 *   ADMIN_EMAIL='you@example.com' ADMIN_NEW_PASSWORD='...' pnpm reset-admin-password
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const email = process.env.ADMIN_EMAIL || 'gracemorganmaxwell@gmail.com'
const newPassword = process.env.ADMIN_NEW_PASSWORD

if (!newPassword) {
  console.error('Missing ADMIN_NEW_PASSWORD.')
  console.error("Example: ADMIN_NEW_PASSWORD='my-new-password' pnpm reset-admin-password")
  process.exit(1)
}

if (newPassword.length < 8) {
  console.error('Use a password with at least 8 characters.')
  process.exit(1)
}

const payload = await getPayload({ config: await config })

const { docs } = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  overrideAccess: true,
})

if (!docs.length) {
  console.error(`No user found for: ${email}`)
  console.error('Check Neon: SELECT email FROM users;')
  process.exit(1)
}

await payload.update({
  collection: 'users',
  id: docs[0].id,
  data: {
    password: newPassword,
    loginAttempts: 0,
    lockUntil: null,
  },
  overrideAccess: true,
})

console.log(`Password updated and account unlocked for ${email}`)
console.log('Log in at http://localhost:3000/admin')

process.exit(0)
