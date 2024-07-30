import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client()
const bucketName = process.env.ATTACHMENTS_S3_BUCKET

export async function getUploadUrl(todoId) {
  console.log(`Generating url for todo with id ${todoId}`)

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  })

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 500
  })

  return url
}
