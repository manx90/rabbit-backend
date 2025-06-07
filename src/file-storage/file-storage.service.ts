import { Injectable, NotFoundException } from '@nestjs/common';
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  unlinkSync,
  rmSync,
} from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileStorageService {
  private readonly uploadDir = 'uploads';
  private readonly productImagesDir = join(this.uploadDir, 'products');

  constructor() {
    // Ensure upload directories exist
    this.ensureDirectoryExists(this.uploadDir);
    this.ensureDirectoryExists(this.productImagesDir);
  }

  private ensureDirectoryExists(dir: string): void {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Save a file to storage and return the file path
   */
  async saveFile(
    file: Express.Multer.File,
    subDirectory = 'products',
  ): Promise<string> {
    const dir = join(this.uploadDir, subDirectory);
    this.ensureDirectoryExists(dir);

    const uniqueFilename = `${uuidv4()}${extname(file.originalname)}`;
    const filePath = join(dir, uniqueFilename);

    // Use promisified version of writeFile
    await new Promise<void>((resolve) => {
      writeFileSync(filePath, file.buffer);
      resolve();
    });

    // Return relative path that can be used in URLs
    return `${subDirectory}/${uniqueFilename}`;
  }

  /**
   * Save multiple files to storage and return their paths
   */
  async saveFiles(
    files: Express.Multer.File[],
    subDirectory = 'products',
  ): Promise<string[]> {
    return Promise.all(files.map((file) => this.saveFile(file, subDirectory)));
  }

  /**
   * Get a file from storage
   */
  getFile(filePath: string): Buffer {
    const fullPath = join(this.uploadDir, filePath);

    if (!existsSync(fullPath)) {
      throw new NotFoundException(`File ${filePath} not found`);
    }

    return readFileSync(fullPath);
  }

  /**
   * Update a file in storage and return the new file path
   */
  async updateFile(
    file: Express.Multer.File,
    oldFilePath: string,
    subDirectory = 'products',
  ): Promise<string> {
    // Delete the old file if it exists
    this.deleteFile(oldFilePath);

    // Save and return the new file
    return await this.saveFile(file, subDirectory);
  }

  /**
   * Delete a file from storage
   */
  deleteFile(filePath: string | null | undefined): boolean {
    if (!filePath) return false;

    const fullPath = join(this.uploadDir, filePath);

    console.log('FileStorageService.deleteFile:', {
      originalPath: filePath,
      fullPath,
      exists: existsSync(fullPath),
    });

    if (!existsSync(fullPath)) return false;

    try {
      unlinkSync(fullPath);
      return true;
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple files from storage
   */
  deleteFiles(filePaths: string[] | null | undefined): boolean[] {
    if (!filePaths) return [];
    return filePaths.map((path) => this.deleteFile(path));
  }

  /**
   * Get the full URL for a file path
   */
  /**
   * Delete a directory and all its contents
   */
  deleteDirectory(dirPath: string): boolean {
    if (!dirPath) return false;

    const fullPath = join(this.uploadDir, dirPath);

    console.log('FileStorageService.deleteDirectory:', {
      originalPath: dirPath,
      fullPath,
      exists: existsSync(fullPath),
    });

    if (!existsSync(fullPath)) return false;

    try {
      // Remove directory and all contents recursively
      rmSync(fullPath, { recursive: true, force: true });
      return true;
    } catch (error) {
      console.error(`Error deleting directory ${dirPath}:`, error);
      return false;
    }
  }

  getFileUrl(
    filePath: string,
    req?: { protocol: string; get: (key: string) => string },
  ): string {
    if (!filePath) return '';

    // If the path is already a full URL, return it
    if (filePath.startsWith('http')) {
      return filePath;
    }

    // If request object is provided, construct full URL
    if (req) {
      const protocol = req.protocol;
      const host = req.get('host');
      return `${protocol}://${host}/${this.uploadDir}/${filePath}`;
    }

    // Otherwise return relative path
    return `/${this.uploadDir}/${filePath}`;
  }
}
