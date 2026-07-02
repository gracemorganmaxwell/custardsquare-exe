import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => Boolean(req.user)

export const publishedOnly: Access = ({ req }) => {
  if (req.user) {
    return true
  }

  return {
    status: {
      equals: 'published',
    },
  }
}
