import {
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/webp': [0x52, 0x49, 0x46, 0x46],
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly presignedUrlTtl: number;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET || 'ifarm-identity-documents';
    this.presignedUrlTtl = parseInt(
      process.env.S3_PRESIGNED_URL_TTL_SECONDS || '900',
      10,
    );

    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'sa-east-1',
      ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          }
        : {}),
    });
  }

  async uploadDocument(
    prefix: string,
    file: Express.Multer.File,
  ): Promise<string> {
    if (!file || !file.buffer) {
      throw new BadRequestException('File buffer is empty');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    const detectedMimeType = this.detectMimeType(file.buffer);
    if (!detectedMimeType || !ALLOWED_MIME_TYPES.includes(detectedMimeType)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}. Detected: ${detectedMimeType || 'unknown'}`,
      );
    }

    const extension = this.getExtension(detectedMimeType);
    const s3Key = `${prefix}/${uuidv4()}${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
      Body: file.buffer,
      ContentType: detectedMimeType,
      ServerSideEncryption: 'AES256',
      Metadata: {
        originalName: file.originalname || 'unknown',
        uploadedAt: new Date().toISOString(),
      },
    });

    await this.s3Client.send(command);
    this.logger.log(`Document uploaded to S3: ${s3Key}`);

    return s3Key;
  }

  async getPresignedUrl(s3Key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: s3Key,
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.presignedUrlTtl,
    });

    this.logger.debug(`Presigned URL generated for: ${s3Key}`);
    return url;
  }

  private detectMimeType(buffer: Buffer): string | null {
    for (const [mimeType, bytes] of Object.entries(MAGIC_BYTES)) {
      if (buffer.length >= bytes.length) {
        const matches = bytes.every(
          (byte, index) => buffer[index] === byte,
        );
        if (matches) {
          return mimeType;
        }
      }
    }

    return null;
  }

  private getExtension(mimeType: string): string {
    const extensionMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
    };

    return extensionMap[mimeType] || '.bin';
  }
}
