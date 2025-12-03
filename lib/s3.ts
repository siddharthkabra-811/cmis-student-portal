import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

export interface UploadResult {
  key: string;
  url: string;
  path: string;
}

/**
 * Upload a file to S3 bucket
 * @param file - File buffer or stream
 * @param fileName - Original file name
 * @param folder - Folder path in S3 (e.g., 'resumes')
 * @param contentType - MIME type of the file
 * @returns Upload result with key, URL, and path
 */
export async function uploadToS3(
  file: Buffer,
  fileName: string,
  folder: string = 'resumes',
  contentType: string = 'application/pdf'
): Promise<UploadResult> {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  // Generate unique file key
  const fileExtension = fileName.split('.').pop() || 'pdf';
  const uniqueId = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  const key = `${folder}/${timestamp}-${uniqueId}.${fileExtension}`;

  // Upload to S3
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    // Make file publicly readable (optional - adjust based on your security needs)
    // ACL: 'public-read',
  });

  await s3Client.send(command);

  // Generate presigned URL (valid for 6 days - AWS S3 v4 limit is 7 days)
  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 518400 } // 6 days (AWS S3 v4 presigned URLs max is 7 days)
  );

  return {
    key,
    url,
    path: key, // Store the key as path in database
  };
}

/**
 * Delete a file from S3 bucket
 * @param key - S3 object key
 */
export async function deleteFromS3(key: string): Promise<void> {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Get a presigned URL for accessing a file
 * @param key - S3 object key
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Presigned URL
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

