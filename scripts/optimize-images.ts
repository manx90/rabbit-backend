import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ImageOptimizationService } from '../src/file-storage/image-optimization.service';
import { Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';

async function optimizeAllImages() {
  const logger = new Logger('ImageOptimizer');

  try {
    logger.log('Starting image optimization script...');

    // Create a minimal app context to access services
    const app = await NestFactory.createApplicationContext(AppModule);
    const imageOptimizationService = app.get(ImageOptimizationService);

    logger.log('Optimizing all images in uploads folder...');

    // Create optimized folder
    const optimizedFolder = 'uploads_optimized';
    await fs.ensureDir(optimizedFolder);

    const results = await imageOptimizationService.optimizeAllUploads({
      quality: 20, // Only compress, don't resize
      format: 'jpeg',
      progressive: true,
    });

    // Calculate summary statistics
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

    logger.log('=== OPTIMIZATION SUMMARY ===');
    logger.log(`Total images processed: ${results.length}`);
    logger.log(`Successfully optimized: ${successful.length}`);
    logger.log(`Failed: ${failed.length}`);
    logger.log(
      `Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`,
    );
    logger.log(
      `Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`,
    );
    logger.log(
      `Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`,
    );
    logger.log(`Average reduction: ${averageReduction.toFixed(1)}%`);
    logger.log(`Backups created in: uploads_backup/`);
    logger.log(`Optimized files created in: ${optimizedFolder}/`);

    if (successful.length > 0) {
      logger.log('\n=== MANUAL REPLACEMENT INSTRUCTIONS ===');
      logger.log('To replace original files with optimized versions:');
      logger.log('1. Stop your application');
      logger.log('2. Copy optimized files to replace originals:');
      logger.log(`   xcopy "${optimizedFolder}\\*" "uploads\\" /E /Y`);
      logger.log('3. Restart your application');
      logger.log(
        '\nOr manually copy files from optimized folder to uploads folder',
      );
    }

    if (failed.length > 0) {
      logger.warn('Failed optimizations:');
      failed.forEach((f) => {
        logger.warn(`  - ${f.originalPath}: ${f.error}`);
      });
    }

    await app.close();
    logger.log('Image optimization script completed successfully!');
  } catch (error) {
    logger.error('Error during image optimization:', error);
    process.exit(1);
  }
}

// Run the script
optimizeAllImages();
