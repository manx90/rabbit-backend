/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { FileStorageController } from './file-storage.controller';
import { ImageOptimizationService } from './image-optimization.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ServeStaticModule } from '@nestjs/serve-static';
import { existsSync, mkdirSync } from 'fs';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Get product name from the request body
          const productName = req.body?.createProductDto
            ? JSON.parse(req.body.createProductDto)
                .name.replace(/\s+/g, '_')
                .toLowerCase()
            : 'temp';

          // Create base uploads directory if it doesn't exist
          const baseDir = './uploads';
          if (!existsSync(baseDir)) {
            mkdirSync(baseDir, { recursive: true });
          }

          // Create product-specific directory
          const productDir = join(baseDir, 'products', productName);
          if (!existsSync(productDir)) {
            mkdirSync(productDir, { recursive: true });
          }

          // Create subdirectories based on file field name
          const fieldName = file.fieldname;
          let uploadPath = productDir;

          if (fieldName === 'imgCover') {
            uploadPath = join(productDir, 'cover');
          } else if (fieldName === 'imgSizeChart') {
            uploadPath = join(productDir, 'sizechart');
          } else if (fieldName === 'imgMeasure') {
            uploadPath = join(productDir, 'measure');
          } else if (fieldName === 'imgColors') {
            uploadPath = join(productDir, 'colors');
          } else if (fieldName === 'images') {
            uploadPath = join(productDir, 'images');
          }

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [FileStorageController],
  providers: [FileStorageService, ImageOptimizationService],
  exports: [FileStorageService, ImageOptimizationService],
})
export class FileStorageModule {}
