import { Injectable, BadRequestException } from '@nestjs/common';
import { IFileStorageService } from '../../interfaces/IFileStorageService';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class LocalFileStorageService implements IFileStorageService {
  async save(file: any, destination: string): Promise<string> {
    if (!file || !file.buffer) {
      throw new BadRequestException('File not provided or invalid');
    }

    const uploadsRoot = join(process.cwd(), 'uploads');
    const destFolder = join(uploadsRoot, destination);

    await fs.mkdir(destFolder, { recursive: true });

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalName = (file.originalname || 'file').replace(/\s+/g, '_');
    const filename = `${uniqueSuffix}-${originalName}`;
    const fullPath = join(destFolder, filename);
    await fs.writeFile(fullPath, file.buffer);

    const relativePath = join('uploads', destination, filename).replace(/\\/g, '/');
    return relativePath;
  }

  async delete(filePath: string): Promise<void> {
    try {
      const fullPath = join(process.cwd(), filePath);
      await fs.unlink(fullPath);
    } catch (error) {
      // Don't throw error if file doesn't exist
      if ((error as any).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}
