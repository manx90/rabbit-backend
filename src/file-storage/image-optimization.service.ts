import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';

export interface OptimizationOptions {
  quality?: number; // 1-100, default 70
  maxWidth?: number; // default 1920
  maxHeight?: number; // default 1080
  format?: 'jpeg' | 'png' | 'webp' | 'avif' | 'svg'; // default 'jpeg'
  progressive?: boolean; // default true
}

export interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  reductionPercentage: number;
  originalPath: string;
  optimizedPath: string;
  backupPath: string;
  success: boolean;
  error?: string;
}

@Injectable()
export class ImageOptimizationService {
  private readonly logger = new Logger(ImageOptimizationService.name);
  private readonly isProduction = process.env.NODE_ENV === 'production';
  private readonly defaultOptions: OptimizationOptions = {
    quality: 50, // Default quality (will be overridden based on file size)
    format: 'jpeg',
    progressive: true,
  };

  /**
   * Optimize a single image file
   */
  async optimizeImage(
    inputPath: string,
    outputPath?: string,
    options: OptimizationOptions = {},
  ): Promise<OptimizationResult> {
    // In production mode, skip heavy optimization to save memory
    if (this.isProduction) {
      this.logger.log(
        `Skipping image optimization in production mode for: ${inputPath}`,
      );
      return {
        originalSize: 0,
        optimizedSize: 0,
        reductionPercentage: 0,
        originalPath: inputPath,
        optimizedPath: inputPath,
        backupPath: inputPath,
        success: true,
      };
    }

    // Start with default options
    const opts = { ...this.defaultOptions, ...options };

    // Create backup path - preserve directory structure
    const relativePath = path.relative('uploads', inputPath);
    const backupPath = path.join('uploads_backup', relativePath);

    // Create optimized file path in separate folder
    const optimizedPath = path.join('uploads_optimized', relativePath);
    const finalOutputPath = outputPath || optimizedPath;

    try {
      // Create backup directory and copy original file
      await fs.ensureDir(path.dirname(backupPath));
      await fs.copy(inputPath, backupPath);

      // Get original file stats
      const originalStats = await fs.stat(inputPath);
      const originalSize = originalStats.size;

      // Check if this is a sizechart or measure image - skip compression for these
      const isSizechartOrMeasure =
        inputPath.includes('sizechart') || inputPath.includes('measure');

      if (isSizechartOrMeasure) {
        // Don't compress sizechart or measure images - keep original quality
        opts.quality = 100;
        this.logger.log(
          `Skipping compression for ${path.basename(inputPath)} (sizechart/measure)`,
        );
      } else {
        // Dynamically set quality based on file size
        // If file is less than 150KB, use 50% quality
        // If file is 150KB or larger, use 30% quality
        const sizeInKB = originalSize / 1024;
        if (!options.quality) {
          // Only override if not explicitly set
          if (sizeInKB < 150) {
            opts.quality = 50; // Moderate compression for smaller files
          } else {
            opts.quality = 30; // Higher compression for larger files
          }
        }
      }

      // Read the image
      const image = sharp(inputPath);

      // Get image metadata
      const metadata = await image.metadata();

      // Keep original dimensions - only compress, don't resize
      const { width, height } = metadata;

      // Apply transformations without resizing
      let processedImage = image;

      // Apply format-specific optimizations
      switch (opts.format) {
        case 'jpeg':
          processedImage = processedImage.jpeg({
            quality: opts.quality,
            progressive: opts.progressive,
            mozjpeg: true,
          });
          break;
        case 'png':
          processedImage = processedImage.png({
            quality: opts.quality,
            progressive: opts.progressive,
            compressionLevel: 9,
          });
          break;
        case 'webp':
          processedImage = processedImage.webp({
            quality: opts.quality,
            effort: 6,
          });
          break;
        case 'avif':
          processedImage = processedImage.avif({
            quality: opts.quality,
            effort: 6,
          });
          break;
        // Note: Sharp does not support SVG output. Skipping 'svg' case.
      }

      // Ensure output directory exists
      await fs.ensureDir(path.dirname(finalOutputPath));

      // Save optimized image to optimized folder
      await processedImage.toFile(finalOutputPath);

      // Get optimized file stats
      const optimizedStats = await fs.stat(finalOutputPath);
      const optimizedSize = optimizedStats.size;

      const reductionPercentage =
        ((originalSize - optimizedSize) / originalSize) * 100;

      this.logger.log(
        `Optimized: ${path.basename(inputPath)} - ${originalSize}KB → ${optimizedSize}KB (${reductionPercentage.toFixed(1)}% reduction)`,
      );

      // No need to replace original - optimized file is saved separately

      return {
        originalSize,
        optimizedSize,
        reductionPercentage,
        originalPath: inputPath,
        optimizedPath: finalOutputPath,
        backupPath: backupPath,
        success: true,
      };
    } catch (error) {
      this.logger.error(`Failed to optimize ${inputPath}: ${error.message}`);

      // No cleanup needed - optimized files are saved separately

      return {
        originalSize: 0,
        optimizedSize: 0,
        reductionPercentage: 0,
        originalPath: inputPath,
        optimizedPath: finalOutputPath,
        backupPath: backupPath,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Optimize a buffer (for new uploads)
   */
  async optimizeBuffer(
    buffer: Buffer,
    options: OptimizationOptions = {},
  ): Promise<Buffer> {
    const opts = { ...this.defaultOptions, ...options };

    try {
      let processedImage = sharp(buffer);

      // Get image metadata
      const metadata = await processedImage.metadata();

      // Keep original dimensions - only compress, don't resize
      const { width, height } = metadata;

      // Apply transformations without resizing
      processedImage = processedImage;

      // Apply format-specific optimizations
      switch (opts.format) {
        case 'jpeg':
          processedImage = processedImage.jpeg({
            quality: opts.quality,
            progressive: opts.progressive,
            mozjpeg: true,
          });
          break;
        case 'png':
          processedImage = processedImage.png({
            quality: opts.quality,
            progressive: opts.progressive,
            compressionLevel: 9,
          });
          break;
        case 'webp':
          processedImage = processedImage.webp({
            quality: opts.quality,
            effort: 6,
          });
          break;
        case 'avif':
          processedImage = processedImage.avif({
            quality: opts.quality,
            effort: 6,
          });
          break;
      }

      return await processedImage.toBuffer();
    } catch (error) {
      this.logger.error(`Failed to optimize buffer: ${error.message}`);
      throw error;
    }
  }

  /**
   * Batch optimize all images in a directory
   */
  async optimizeDirectory(
    directoryPath: string,
    options: OptimizationOptions = {},
    recursive = true,
  ): Promise<OptimizationResult[]> {
    const results: OptimizationResult[] = [];

    try {
      // Use fs-extra to find all image files recursively
      const findImageFiles = async (dir: string): Promise<string[]> => {
        const files: string[] = [];
        const items = await fs.readdir(dir);

        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);

          if (stat.isDirectory() && recursive) {
            const subFiles = await findImageFiles(fullPath);
            files.push(...subFiles);
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
              files.push(fullPath);
            }
          }
        }

        return files;
      };

      const files = await findImageFiles(directoryPath);
      this.logger.log(
        `Found ${files.length} images to optimize in ${directoryPath}`,
      );

      for (const file of files) {
        const result = await this.optimizeImage(file, undefined, options);
        results.push(result);
      }

      // Log summary
      const successful = results.filter((r) => r.success);
      const totalOriginalSize = successful.reduce(
        (sum, r) => sum + r.originalSize,
        0,
      );
      const totalOptimizedSize = successful.reduce(
        (sum, r) => sum + r.optimizedSize,
        0,
      );
      const averageReduction =
        successful.length > 0
          ? successful.reduce((sum, r) => sum + r.reductionPercentage, 0) /
            successful.length
          : 0;

      this.logger.log(
        `Batch optimization complete: ${successful.length}/${files.length} successful, ` +
          `${(totalOriginalSize / 1024).toFixed(1)}KB → ${(totalOptimizedSize / 1024).toFixed(1)}KB ` +
          `(${averageReduction.toFixed(1)}% average reduction)`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to optimize directory ${directoryPath}: ${error.message}`,
      );
    }

    return results;
  }

  /**
   * Optimize all images in the uploads folder
   */
  async optimizeAllUploads(
    options: OptimizationOptions = {},
  ): Promise<OptimizationResult[]> {
    const uploadsPath = 'uploads';

    if (!(await fs.pathExists(uploadsPath))) {
      this.logger.warn('Uploads directory does not exist');
      return [];
    }

    this.logger.log('Starting optimization of all uploads...');
    return await this.optimizeDirectory(uploadsPath, options, true);
  }

  /**
   * Get supported image formats
   */
  getSupportedFormats(): string[] {
    return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'JPG', 'JPEG', 'PNG', 'WEBP'];
  }

  /**
   * Check if a file is a supported image format
   */
  isSupportedImage(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase().slice(1);
    return this.getSupportedFormats().includes(ext);
  }
}
