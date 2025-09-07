/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ParsedQs } from 'qs';
import { auth } from 'src/auth/entities/auth.entity';
import { PublishState } from 'src/common/interfaces/entity.interface';
import { ApiFeatures } from 'src/common/utils/api-features';
import { Repository } from 'typeorm';
import { FileStorageService } from '../file-storage/file-storage.service';
import { LoggerService } from '../common/utils/logger.service';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { category, subCategory } from './entities/Category.entity';
import { product } from './entities/product.entity';

interface UploadFiles {
  images?: Express.Multer.File[];
  imgCover?: Express.Multer.File[];
  imgSizeChart?: Express.Multer.File[];
  imgMeasure?: Express.Multer.File[];
  imgColors?: Express.Multer.File[];
}

@Injectable()
export class ProductCrud {
  constructor(
    @InjectRepository(product)
    private readonly productRepo: Repository<product>,
    @InjectRepository(category)
    private readonly categoryRepo: Repository<category>,
    @InjectRepository(subCategory)
    private readonly subCategoryRepo: Repository<subCategory>,
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  private async saveFiles(
    files: Express.Multer.File[] = [],
    productName: string,
    subDirectory: string,
  ): Promise<string[]> {
    const productPath = `products/${productName.replace(/\s+/g, '_').toLowerCase()}/${subDirectory}`;
    return await this.fileStorageService.saveFiles(files, productPath, {
      quality: 50,
      format: 'jpeg',
      progressive: true,
    });
  }

  private async saveFile(
    file: Express.Multer.File,
    productName: string,
    subDirectory: string,
  ): Promise<string> {
    const productPath = `products/${productName.replace(/\s+/g, '_').toLowerCase()}/${subDirectory}`;
    // Skip compression for sizechart and measure files
    if (subDirectory === 'sizechart' || subDirectory === 'measure') {
      // Don't compress these files - keep original quality
      return await this.fileStorageService.saveFile(file, productPath, {
        quality: 100, // Keep original quality
        format: 'jpeg',
        progressive: true,
      });
    } else {
      return await this.fileStorageService.saveFile(file, productPath, {
        quality: 50,
        format: 'jpeg',
        progressive: true,
      });
    }
  }

  private async uploadFiles(
    files: UploadFiles,
    productName: string,
  ): Promise<{
    images?: string[];
    imgCover?: string;
    imgSizeChart?: string;
    imgMeasure?: string;
    imgColors?: string[];
  }> {
    const result: any = {};

    if (files.images && files.images.length > 0) {
      result.images = await this.saveFiles(files.images, productName, 'images');
    }
    if (files.imgCover && files.imgCover.length > 0) {
      result.imgCover = await this.saveFile(
        files.imgCover[0],
        productName,
        'cover',
      );
    }
    if (files.imgSizeChart && files.imgSizeChart.length > 0) {
      result.imgSizeChart = await this.saveFile(
        files.imgSizeChart[0],
        productName,
        'size-chart',
      );
    }
    if (files.imgMeasure && files.imgMeasure.length > 0) {
      result.imgMeasure = await this.saveFile(
        files.imgMeasure[0],
        productName,
        'measure',
      );
    }
    if (files.imgColors && files.imgColors.length > 0) {
      result.imgColors = await this.saveFiles(
        files.imgColors,
        productName,
        'colors',
      );
    }
    return result;
  }

  private transformProductUrls(products: product[], req: Request): any[] {
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    return products.map((product) => {
      // Create a clone of the product to avoid modifying the original
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const transformed = Object.create(
        Object.getPrototypeOf(product),
        Object.getOwnPropertyDescriptors(product),
      );
      // Transform image cover URL
      if (transformed.imgCover && !transformed.imgCover.startsWith('http')) {
        transformed.imgCover = `${baseUrl}/uploads/${transformed.imgCover}`;
      }
      // Transform size chart image URL
      if (
        transformed.imgSizeChart &&
        !transformed.imgSizeChart.startsWith('http')
      ) {
        transformed.imgSizeChart = `${baseUrl}/uploads/${transformed.imgSizeChart}`;
      }
      // Transform measure image URL
      if (
        transformed.imgMeasure &&
        !transformed.imgMeasure.startsWith('http')
      ) {
        transformed.imgMeasure = `${baseUrl}/uploads/${transformed.imgMeasure}`;
      }
      // Transform product images URLs
      if (transformed.images && Array.isArray(transformed.images)) {
        transformed.images = transformed.images.map((img: string) =>
          img && !img.startsWith('http') ? `${baseUrl}/uploads/${img}` : img,
        );
      }
      // Transform color images URLs
      if (transformed.colors && Array.isArray(transformed.colors)) {
        transformed.colors = transformed.colors.map((color) => ({
          ...color,
          imgColor:
            color.imgColor && !color.imgColor.startsWith('http')
              ? `${baseUrl}/uploads/${color.imgColor}`
              : color.imgColor,
        }));
      }

      return transformed;
    });
  }
  /** ----------  Get All Products  ---------- */
  async getAllProducts(
    query: ParsedQs,
    req?: Request,
  ): Promise<{
    status: string;
    results: number;
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
    lastPage: number;
    data: product[];
  }> {
    try {
      this.logger.debug(
        `Starting getAllProducts with query: ${JSON.stringify(query)}`,
        'ProductCrud',
      );

      const queryBuilder = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.subCategory', 'subCategory')
        .leftJoinAndSelect('product.poster', 'auth')
        .select([
          'product',
          'category.id',
          'category.name',
          'subCategory.name',
          'subCategory.id',
          'auth.username',
        ]);

      this.logger.debug('Query builder created successfully', 'ProductCrud');

      const features = new ApiFeatures(
        queryBuilder,
        query || {},
        this.productRepo.metadata,
      )
        .filter()
        .sort()
        .paginate();

      this.logger.debug('ApiFeatures applied successfully', 'ProductCrud');

      this.logger.logDatabaseOperation(
        'SELECT',
        'product',
        { query: query },
        'ProductCrud',
      );
      const [data, total] = await features.getManyAndCount();
      this.logger.info(
        `Query executed successfully. Found ${data.length} products, total: ${total}`,
        'ProductCrud',
      );

      const transformedData = req ? this.transformProductUrls(data, req) : data;
      this.logger.debug('Data transformation completed', 'ProductCrud');

      const pagination = features.getPaginationInfo();

      const result = {
        status: 'success',
        results: transformedData.length,
        total,
        currentPage: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
        lastPage: Math.ceil(total / pagination.limit),
        data: transformedData,
      };

      this.logger.debug(
        `Returning result: ${JSON.stringify({
          status: result.status,
          results: result.results,
          total: result.total,
          currentPage: result.currentPage,
          limit: result.limit,
        })}`,
        'ProductCrud',
      );

      return result;
    } catch (error) {
      this.logger.logError(error, 'ProductCrud', { query: query });
      throw error;
    }
  }
  async create(
    dto: CreateProductDto,
    files: UploadFiles = {},
    poster: auth,
    req?: Request,
  ): Promise<product> {
    // 1) بناء الكيان الأساسي
    const Product = new product();
    const existingProduct = await this.productRepo.findOne({
      where: { name: dto.name },
    });
    if (existingProduct)
      throw new BadRequestException('Product name already exists');
    Product.name = dto.name;
    Product.description = dto.description;
    Product.poster = { id: poster.id, username: poster.username };
    Product.category = await this.fetchCategory(dto.categoryId);
    Product.subCategory = await this.fetchSubCategory(
      dto.categoryId,
      dto.subCategoryId,
    );
    Product.publishState = dto.publishState as PublishState;

    // 2) Save images to file system and store paths in database
    try {
      // Initialize image fields
      Product.imgCover = '';
      Product.imgSizeChart = '';
      Product.imgMeasure = '';
      Product.images = [];

      // Save cover image if provided
      if (files.imgCover && files.imgCover[0]) {
        Product.imgCover = await this.saveFile(
          files.imgCover[0],
          dto.name,
          'cover',
        );
      }

      // Save size chart image if provided
      if (files.imgSizeChart && files.imgSizeChart[0]) {
        Product.imgSizeChart = await this.saveFile(
          files.imgSizeChart[0],
          dto.name,
          'sizechart',
        );
      }

      // Save measure image if provided
      if (files.imgMeasure && files.imgMeasure[0]) {
        Product.imgMeasure = await this.saveFile(
          files.imgMeasure[0],
          dto.name,
          'measure',
        );
      }

      // Validate that the count of color images matches the count of color names
      if (files.imgColors && files.imgColors.length !== dto.colors?.length) {
        throw new BadRequestException(
          'The count of color images must match the count of color names',
          'COLORS_AND_IMAGES_COUNT_DO_NOT_MATCH',
        );
      }

      // Save gallery images if provided
      if (files.images && files.images.length > 0) {
        Product.images = await this.saveFiles(files.images, dto.name, 'images');
      }
    } catch (error) {
      console.error('Error saving images:', error);
      throw new Error('Failed to save product images');
    }

    // Save color images to file system and validate
    if (files.imgColors && files.imgColors.length > 0) {
      if (!dto.colors || !Array.isArray(dto.colors)) {
        throw new BadRequestException(
          'Colors array is required when uploading color images',
        );
      }

      // Save all color images first
      const colorImagePaths = await this.saveFiles(
        files.imgColors,
        dto.name,
        'colors',
      );

      // Map color images to colors array
      Product.colors = colorImagePaths.map((imgPath, index) => ({
        name:
          dto.colors && dto.colors[index]
            ? dto.colors[index].name
            : `Color ${index + 1}`,
        imgColor: imgPath,
      }));
    } else if (dto.colors && Array.isArray(dto.colors)) {
      // Handle colors without images
      Product.colors = dto.colors.map((color) => ({
        name: color.name,
        imgColor: '',
      }));
    }

    // 3) Categories
    Product.category = await this.fetchCategory(dto.categoryId);
    Product.subCategory = await this.fetchSubCategory(
      dto.categoryId,
      dto.subCategoryId,
    );

    // Poster is already assigned in the initial setup

    // 6) Size Details
    // Validate that color names in quantities match the defined colors
    if (
      dto.sizes &&
      Array.isArray(dto.sizes) &&
      dto.colors &&
      Array.isArray(dto.colors)
    ) {
      const colorNames = dto.colors.map((color) => color.name);
      const sizeColorNames = new Set<string>();

      // Collect all color names used in sizes
      for (const size of dto.sizes) {
        for (const colorQty of size.quantities) {
          sizeColorNames.add(colorQty.colorName);
        }
      }

      // Convert set to array for comparison
      const uniqueSizeColorNames = Array.from(sizeColorNames);

      // Check if the count and names match exactly
      if (uniqueSizeColorNames.length !== colorNames.length) {
        throw new BadRequestException(
          'Number of colors in sizes does not match the number of colors defined in the colors list',
        );
      }

      // Check if all colors in sizes exist in colors array and vice versa
      for (const colorName of uniqueSizeColorNames) {
        if (!colorNames.includes(colorName)) {
          throw new BadRequestException(
            `Color "${colorName}" used in sizes is not defined in the colors list`,
          );
        }
      }

      for (const colorName of colorNames) {
        if (!uniqueSizeColorNames.includes(colorName)) {
          throw new BadRequestException(
            `Color "${colorName}" defined in colors list is not used in any size`,
          );
        }
      }
    }
    //  Date Published
    if (dto.datePublished) {
      Product.datePublished = dto.datePublished;
      Product.publishState = PublishState.DRAFT;
    }
    Product.sizeDetails = dto.sizes.map((size) => ({
      sizeName: size.sizeName,
      price: size.price,
      quantities: size.quantities.map((colorQty) => ({
        colorName: colorQty.colorName,
        quantity: colorQty.quantity,
      })),
    }));

    if (dto.wordKeys) Product.wordKeys = dto.wordKeys;
    if (dto.videoLink) Product.videoLink = dto.videoLink;
    if (dto.season) Product.season = dto.season;

    // Calculate total quantity
    Product.quantity = Product.getTotalQuantity();

    try {
      // Save the product to database
      const savedProduct = await this.productRepo.save(Product);

      // Transform file paths to full URLs if request object is provided
      if (req) {
        const [transformedProduct] = this.transformProductUrls(
          [savedProduct],
          req,
        );
        return transformedProduct;
      }

      return savedProduct;
    } catch (error) {
      console.error('Error saving product:', error);
      throw new Error('Failed to save product');
    }
  }
  /** ----------  Update  ---------- */
  async update(
    id: number,
    dto: UpdateProductDto,
    files: UploadFiles = {},
    req: Request,
  ): Promise<product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'poster'],
    });
    if (!product) throw new NotFoundException('Product not found');
    if (dto.name) product.name = dto.name;
    if (dto.description) product.description = dto.description;
    if (dto.categoryId)
      product.category = await this.fetchCategory(dto.categoryId);
    if (dto.subCategoryId)
      product.subCategory = await this.fetchSubCategory(
        dto.categoryId as number,
        dto.subCategoryId,
      );
    if (dto.publishState) product.publishState = dto.publishState;

    // Update files if provided - save to file system and handle old files properly
    try {
      // Handle product images (multiple files)
      if (files.images && files.images.length > 0) {
        // Delete old images if they exist
        if (product.images && product.images.length > 0) {
          this.fileStorageService.deleteFiles(product.images);
        }
        // Save new images
        product.images = await this.saveFiles(
          files.images,
          product.name,
          'images',
        );
      }

      // Handle product cover image (single file)
      if (files.imgCover && files.imgCover[0]) {
        // Delete old cover image if it exists
        if (product.imgCover) {
          this.fileStorageService.deleteFile(product.imgCover);
        }
        // Save new cover image
        product.imgCover = await this.saveFile(
          files.imgCover[0],
          product.name,
          'cover',
        );
      }

      // Handle size chart image (single file)
      if (files.imgSizeChart && files.imgSizeChart[0]) {
        // Delete old size chart image if it exists
        if (product.imgSizeChart) {
          this.fileStorageService.deleteFile(product.imgSizeChart);
        }
        // Save new size chart image
        product.imgSizeChart = await this.saveFile(
          files.imgSizeChart[0],
          product.name,
          'sizechart',
        );
      }

      // Handle measure image (single file)
      if (files.imgMeasure && files.imgMeasure[0]) {
        // Delete old measure image if it exists
        if (product.imgMeasure) {
          this.fileStorageService.deleteFile(product.imgMeasure);
        }
        // Save new measure image
        product.imgMeasure = await this.saveFile(
          files.imgMeasure[0],
          product.name,
          'measure',
        );
      }
    } catch (error) {
      console.error('Error handling product files:', error);
      throw new Error(`Failed to process product files: ${error.message}`);
    }

    // Update category and subcategory if provided
    if (dto.categoryId)
      product.category = await this.fetchCategory(dto.categoryId);
    if (dto.subCategoryId && dto.categoryId)
      product.subCategory = await this.fetchSubCategory(
        dto.categoryId,
        dto.subCategoryId,
      );
    if (dto.sizes && dto.sizes.length > 0) {
      product.sizeDetails = dto.sizes.map((size, index) => ({
        sizeName: size?.sizeName,
        price: size?.price || product.sizeDetails[index].price,
        quantities: size?.quantities
          ? size.quantities.map((q, index) => ({
              colorName: q.colorName,
              quantity:
                q?.quantity !== undefined
                  ? q.quantity
                  : product.sizeDetails[index].quantities[index].quantity,
              // imgColors:
              //   q.imgColors ||
              //   product.sizeDetails[index].quantities[index].imgColors,
            }))
          : product.sizeDetails[index].quantities,
      }));
    }
    try {
      if (
        dto.colors &&
        dto.colors.length > 0 &&
        files.imgColors &&
        files.imgColors.length > 0
      ) {
        if (product.colors && product.colors.length > 0) {
          const oldColorImages = product.colors
            .map((color) => color.imgColor)
            .filter(
              (imgPath): imgPath is string => !!imgPath && imgPath.length > 0,
            );

          if (oldColorImages.length > 0) {
            this.fileStorageService.deleteFiles(oldColorImages);
          }
        }

        // Save new color images to file system
        const colorImagePaths = await this.saveFiles(
          files.imgColors,
          product.name,
          'colors',
        );

        product.colors = dto.colors.map((color, index) => ({
          name:
            color.name ||
            (product.colors && product.colors[index]
              ? product.colors[index].name
              : ''),
          imgColor:
            colorImagePaths[index] ||
            (product.colors && product.colors[index]
              ? product.colors[index].imgColor
              : ''),
        }));
      } else if (dto.colors && dto.colors.length > 0) {
        // Update color names but keep existing image paths
        product.colors = dto.colors.map((color, index) => ({
          name:
            color.name ||
            (product.colors && product.colors[index]
              ? product.colors[index].name
              : ''),
          imgColor:
            product.colors && product.colors[index]
              ? product.colors[index].imgColor
              : '',
        }));
      }
    } catch (error) {
      console.error('Error handling product color images:', error);
      throw new Error(
        `Failed to process product color images: ${error.message}`,
      );
    }
    product.updatedAt = new Date();
    await this.productRepo.update(id, product);
    const updatedProduct = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'poster'],
    });
    if (!updatedProduct) {
      throw new NotFoundException(
        `Product with ID ${id} not found after update`,
      );
    }
    if (req) {
      const [transformedProduct] = this.transformProductUrls(
        [updatedProduct],
        req,
      );
      return transformedProduct;
    }
    return updatedProduct;
  }
  /** ----------  Helpers  ---------- */
  private async fetchCategory(id: number): Promise<any> {
    const cat = await this.categoryRepo.findOne({
      where: { id },
      relations: ['subCategories'],
    });
    if (!cat) throw new NotFoundException(`Category ${id} not found`);

    return { id: cat.id, name: cat.name };
  }
  private async fetchSubCategory(idCat: number, idSub: number): Promise<any> {
    const sub = await this.subCategoryRepo.findOneBy({
      id: idSub,
      category: { id: idCat },
    });
    if (!sub)
      throw new NotFoundException(
        'SubCategory not found or not exist in this category',
      );
    return { id: sub.id, name: sub.name };
  }
  async remove(
    id: number,
  ): Promise<{ success: boolean; product?: any; message?: string }> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');

    const productInfo = {
      id: product.id,
      name: product.name,
    };
    await this.productRepo.save(product);
    // Delete the entire product directory
    const productPath = `products/${product.name.replace(/\s+/g, '_').toLowerCase()}`;
    this.fileStorageService.deleteDirectory(productPath);
    try {
      await this.productRepo.remove(product);
      return {
        success: true,
        product: productInfo,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        message: `Error deleting product: ${error.message}`,
      };
    }
  }
  async findOne(id: number): Promise<any> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'subCategory'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
  async deleteAll(): Promise<void> {
    const productPath = `products`;
    this.fileStorageService.deleteDirectory(productPath);
    await this.productRepo
      .createQueryBuilder()
      .delete()
      .from(product)
      .where('1 = 1')
      .execute();
  }
  async ConnectProduct(productIds: number[]): Promise<any> {
    const productsIds: number[] = [];
    const products = await Promise.all(
      productIds.map(async (id) => {
        const prod = await this.productRepo.findOne({ where: { id } });
        if (!prod) {
          throw new NotFoundException(`Product with ID ${id} not found`);
        }
        productsIds.push(prod.id);
        return prod;
      }),
    );
    for (const prod of products) {
      prod.productIdsCollection = productsIds;
      await this.productRepo.save(prod);
    }
    return {
      data: products,
      message: 'Products connected successfully',
    };
  }
}
