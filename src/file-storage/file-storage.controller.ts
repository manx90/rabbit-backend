/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { FileStorageService } from './file-storage.service';
import {
  ImageOptimizationService,
  OptimizationOptions,
} from './image-optimization.service';

@Controller('uploads')
export class FileStorageController {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly imageOptimizationService: ImageOptimizationService,
  ) {}

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

  @Post('optimize')
  async optimizeAllImages(@Body() options?: OptimizationOptions) {
    const results =
      await this.imageOptimizationService.optimizeAllUploads(options);

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    const totalOriginalSize = successful.reduce(
      (sum, r) => sum + r.originalSize,
      0,
    );
    const totalOptimizedSize = successful.reduce(
      (sum, r) => sum + r.optimizedSize,
      0,
    );
    const totalSaved = totalOriginalSize - totalOptimizedSize;
    const averageReduction =
      successful.length > 0
        ? successful.reduce((sum, r) => sum + r.reductionPercentage, 0) /
          successful.length
        : 0;

    return {
      message: 'Image optimization completed',
      summary: {
        totalProcessed: results.length,
        successful: successful.length,
        failed: failed.length,
        totalOriginalSizeMB: (totalOriginalSize / 1024 / 1024).toFixed(2),
        totalOptimizedSizeMB: (totalOptimizedSize / 1024 / 1024).toFixed(2),
        totalSavedMB: (totalSaved / 1024 / 1024).toFixed(2),
        averageReduction: averageReduction.toFixed(1) + '%',
      },
      results: results.slice(0, 10), // Return first 10 results for preview
    };
  }
}
