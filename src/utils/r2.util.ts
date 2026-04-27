import AWS from 'aws-sdk';
import config from '../config';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 12);

export const r2 = new AWS.S3({
  endpoint: `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: config.R2_ACCESS_KEY_ID,
  secretAccessKey: config.R2_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'auto',
});

export const uploadToR2 = async (
  buffer: Buffer,
  folder: string,
  contentType: string,
): Promise<string> => {
  const ext = contentType.split('/')[1] || 'webp';
  const key = `${folder}/${nanoid()}.${ext}`;

  await r2.putObject({
    Bucket: config.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }).promise();

  return `${config.R2_PUBLIC_URL}/${key}`;
};

export const deleteFromR2 = async (url: string): Promise<void> => {
  const key = url.replace(`${config.R2_PUBLIC_URL}/`, '');
  await r2.deleteObject({
    Bucket: config.R2_BUCKET_NAME,
    Key: key,
  }).promise();
};
