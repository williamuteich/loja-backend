import { Injectable } from '@nestjs/common';
import { IFileStorageService } from '../../interfaces/IFileStorageService';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class LocalFileStorageService implements IFileStorageService {
  async save(file: any, destination: string): Promise<string> {

    const uploadsRoot = join(process.cwd(), 'uploads');
    const destFolder = join(uploadsRoot, destination);

    await fs.mkdir(destFolder, { recursive: true });

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalName = (file.originalname || 'file').replace(/\s+/g, '_');
    const filename = `${uniqueSuffix}-${originalName}`;

    const fullPath = join(destFolder, filename);

    if (file.buffer) {
      await fs.writeFile(fullPath, file.buffer);
    }

    const relativePath = join('uploads', destination, filename).replace(/\\/g, '/');
    return relativePath;
  }
}
