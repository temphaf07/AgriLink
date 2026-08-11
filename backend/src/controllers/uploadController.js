import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Readable } from 'stream';
import cloudinary, { cloudinaryConfigured } from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

const uploadsDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads');
const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Please select an image file.', 422);

  if (cloudinaryConfigured()) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'agrilink', resource_type: 'image' },
        (error, value) => error ? reject(error) : resolve(value)
      );
      Readable.from(req.file.buffer).pipe(stream);
    });
    return res.status(201).json({
      success: true,
      image: { url: result.secure_url, publicId: result.public_id },
      storage: 'cloudinary'
    });
  }

  // Local storage keeps images usable on localhost without Cloudinary secrets.
  const extension = extensions[req.file.mimetype] || 'jpg';
  const filename = `${randomUUID()}.${extension}`;
  await mkdir(uploadsDirectory, { recursive: true });
  await writeFile(path.join(uploadsDirectory, filename), req.file.buffer);
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return res.status(201).json({
    success: true,
    image: { url: `${baseUrl}/uploads/${filename}`, publicId: `local:${filename}` },
    storage: 'local'
  });
});
