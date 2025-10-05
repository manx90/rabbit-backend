/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Param, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { FileStorageService } from './file-storage.service';
import {
  ImageOptimizationService,
  OptimizationOptions,
} from './image-optimization.service';

@ApiTags('File Storage')
@Controller('uploads')
export class FileStorageController {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly imageOptimizationService: ImageOptimizationService,
  ) {}

  @Get(':subdir/:filename')
  @ApiOperation({ summary: 'Get file by subdirectory and filename' })
  @ApiParam({ name: 'subdir', description: 'Subdirectory path' })
  @ApiParam({ name: 'filename', description: 'File name' })
  @ApiOkResponse({ description: 'File retrieved successfully' })
  @ApiNotFoundResponse({ description: 'File not found' })
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
  @ApiOperation({ summary: 'Optimize all uploaded images' })
  @ApiBody({
    description: 'Optimization options',
    required: false,
    schema: {
      type: 'object',
      properties: {
        quality: { type: 'number', minimum: 1, maximum: 100 },
        format: { type: 'string', enum: ['jpeg', 'png', 'webp'] },
        resize: {
          type: 'object',
          properties: {
            width: { type: 'number' },
            height: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Image optimization completed',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        summary: {
          type: 'object',
          properties: {
            totalProcessed: { type: 'number' },
            successful: { type: 'number' },
            failed: { type: 'number' },
            totalOriginalSizeMB: { type: 'string' },
            totalOptimizedSizeMB: { type: 'string' },
            totalSavedMB: { type: 'string' },
            averageReduction: { type: 'string' },
          },
        },
        results: { type: 'array' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request - invalid optimization options',
  })
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
