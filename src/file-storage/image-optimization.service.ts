/* eslint-disable no-self-assign */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
// DISABLED: Sharp import removed to prevent WebAssembly memory issues
import * as fs from 'fs-extra';
import * as path from 'path';

export interface OptimizationOptions {
  quality?: number; // 1-100, default 70
  maxWidth?: number; // default 1920
  maxHeight?: number; // default 1080
  format?: 'jpeg' | 'png' | 'webp' | 'avif' | 'svg';
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
  private readonly isCPanelHosting = process.env.NODE_ENV === 'production' && process.env.MAX_MEMORY_USAGE;

  /**
   * Optimize a single image file - DISABLED to prevent WebAssembly memory issues
   */
  async optimizeImage(
    inputPath: string,
    outputPath?: string,
    options: OptimizationOptions = {},
  ): Promise<OptimizationResult> {
    // DISABLED: Image optimization completely disabled to prevent WebAssembly memory issues
    this.logger.log(
      `Image optimization disabled - returning original file: ${inputPath}`,
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

  /**
   * Optimize all images in a directory - DISABLED
   */
  async optimizeDirectory(
    dirPath: string,
    options: OptimizationOptions = {},
    recursive: boolean = false,
  ): Promise<OptimizationResult[]> {
    // DISABLED: Image optimization completely disabled to prevent WebAssembly memory issues
    this.logger.log(`Image optimization disabled for directory: ${dirPath}`);
    return [];
  }

  /**
   * Optimize all images in the uploads folder - DISABLED
   */
  async optimizeAllUploads(
    options: OptimizationOptions = {},
  ): Promise<OptimizationResult[]> {
    // DISABLED: Image optimization completely disabled to prevent WebAssembly memory issues
    this.logger.log('Image optimization disabled - returning empty results');
    return [];
  }

  /**
   * Optimize image buffer - DISABLED to prevent WebAssembly memory issues
   */
  async optimizeBuffer(
    buffer: Buffer,
    options: OptimizationOptions = {},
  ): Promise<Buffer> {
    // DISABLED: Image optimization completely disabled to prevent WebAssembly memory issues
    this.logger.log('Image buffer optimization disabled - returning original buffer');
    return buffer;
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