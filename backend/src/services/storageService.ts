import { randomUUID } from 'node:crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { env } from '../config/env.js'
import { logger } from '../config/logger.js'

/**
 * Object storage (S3 / Cloudflare R2) for user-uploaded assets — currently the
 * custom alarm ringtone (Global Requirement A). Configuration is optional: when
 * the S3_* env vars are absent, {@link isStorageConfigured} is false and callers
 * return a clear "not configured" error instead of crashing.
 */

let client: S3Client | null = null

export function isStorageConfigured(): boolean {
  return Boolean(
    env.S3_ENDPOINT &&
    env.S3_BUCKET &&
    env.S3_ACCESS_KEY_ID &&
    env.S3_SECRET_ACCESS_KEY &&
    env.S3_PUBLIC_URL,
  )
}

function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID!,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
      },
      // R2 and most S3-compatible endpoints need path-style addressing.
      forcePathStyle: true,
    })
  }
  return client
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
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )
  const base = env.S3_PUBLIC_URL!.replace(/\/$/, '')
  const url = `${base}/${key}`
  logger.info({ key }, 'Uploaded object to storage')
  return { url, key }
}
