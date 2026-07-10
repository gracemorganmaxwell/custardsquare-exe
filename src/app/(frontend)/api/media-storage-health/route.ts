export const dynamic = 'force-dynamic'

export function GET() {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? ''

  return Response.json({
    blobTokenConfigured: blobToken.length > 0,
    blobTokenFormatOk: /^vercel_blob_rw_/i.test(blobToken),
    clientUploadsExpected: blobToken.length > 0,
    vercel: process.env.VERCEL === '1',
    vercelEnv: process.env.VERCEL_ENV ?? null,
    hint: blobToken
      ? 'Blob token is set on this deployment. If uploads still fail, check file size (<4.5MB without client route) or redeploy after env changes.'
      : 'Add BLOB_READ_WRITE_TOKEN to Vercel Project → Settings → Environment Variables (Production + Preview), then redeploy.',
  })
}
