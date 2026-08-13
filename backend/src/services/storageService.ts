import { randomUUID } from 'node:crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { env } from '../config/env.js'
import { logger } from '../config/logger.js'

/**
 * Cloudflare R2 object storage for user-uploaded assets — currently the custom
 * alarm ringtone (Global Requirement A). R2 speaks the S3 API, so we talk to it
 * with the AWS S3 SDK. Configuration is optional: when the R2_* env vars are
 * absent, {@link isStorageConfigured} is false and callers return a clear
 * "not configured" error instead of crashing.
 */

let r2Client: S3Client | null = null

export function isStorageConfigured(): boolean {
  return Boolean(
    env.R2_ENDPOINT &&
    env.R2_BUCKET &&
    env.R2_ACCESS_KEY_ID &&
    env.R2_SECRET_ACCESS_KEY &&
    env.R2_PUBLIC_URL,
  )
}

function getClient(): S3Client {
  if (!r2Client) {
    r2Client = new S3Client({
      endpoint: env.R2_ENDPOINT,
      region: env.R2_REGION,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID!,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
      },
      // R2 needs path-style addressing.
      forcePathStyle: true,
    })
  }
  return r2Client
}

export interface UploadResult {
  url: string
  key: string
}

/**
 * Upload a binary object under `prefix/` and return its public URL. The key is
 * randomised so uploads never collide or overwrite another user's asset.
 */
export async function uploadObject(
  prefix: string,
  body: Buffer,
  contentType: string,
  extension: string,
): Promise<UploadResult> {
  if (!isStorageConfigured()) {
    throw new Error('Object storage is not configured')
  }
  const key = `${prefix}/${randomUUID()}.${extension.replace(/^\./, '')}`
  await getClient().send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )
  const base = env.R2_PUBLIC_URL!.replace(/\/$/, '')
  const url = `${base}/${key}`
  logger.info({ key }, 'Uploaded object to R2 storage')
  return { url, key }
}
