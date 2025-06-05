/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { FileStorageService } from './file-storage.service';

@Controller('uploads')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Get(':subdir/:filename')
  getFile(
    @Param('subdir') subdir: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = join(subdir, filename);
      const file = this.fileStorageService.getFile(filePath);

      // Determine content type based on file extension
      const ext = filename.split('.').pop();
      const contentTypes: Record<string, string> = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        webp: 'image/webp',
        pdf: 'application/pdf',
        // Add more types as needed
      };

      const contentType =
        (ext && contentTypes[ext.toLowerCase()]) || 'application/octet-stream';
      res.type(contentType).send(file);
    } catch (_error) {
      res.status(404).send('File not found');
    }
  }
}
