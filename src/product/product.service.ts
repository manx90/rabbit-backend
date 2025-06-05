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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { product } from './entities/product.entity';
import { category, subCategory } from './entities/Category.entity';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { auth } from 'src/auth/entities/auth.entity';
import { PublishState } from 'src/common/interfaces/entity.interface';
import { ApiFeatures } from 'src/common/utils/api-features';
import { Request } from 'express';
import { ParsedQs } from 'qs';
import { FileStorageService } from '../file-storage/file-storage.service';
import { ConfigService } from '@nestjs/config';

interface UploadFiles {
  images?: Express.Multer.File[];
  imgCover?: Express.Multer.File[];
  imgSizeChart?: Express.Multer.File[];
  imgMeasure?: Express.Multer.File[];
  imgColors?: Express.Multer.File[];
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(product)
    private readonly productRepo: Repository<product>,
    @InjectRepository(category)
    private readonly categoryRepo: Repository<category>,
    @InjectRepository(subCategory)
    private readonly subCategoryRepo: Repository<subCategory>,
    private readonly fileStorageService: FileStorageService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Save files to storage and return their paths
   * This replaces the old mapFiles method that converted to base64
   */
  private async saveFiles(
    files: Express.Multer.File[] = [],
    productName: string,
    subDirectory: string,
  ): Promise<string[]> {
    const productPath = `products/${productName.replace(/\s+/g, '_').toLowerCase()}/${subDirectory}`;
    return await this.fileStorageService.saveFiles(files, productPath);
  }

  /**
   * Save a single file to storage and return its path
   */
  private async saveFile(
    file: Express.Multer.File,
    productName: string,
    subDirectory: string,
  ): Promise<string> {
    const productPath = `products/${productName.replace(/\s+/g, '_').toLowerCase()}/${subDirectory}`;
    return await this.fileStorageService.saveFile(file, productPath);
  }

  /**
   * Transform product file paths to full URLs
   * @param products Array of product entities
   * @param req Express Request object
   * @returns Products with transformed URLs
   */
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
    page: number;
    limit: number;
    data: product[];
  }> {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subCategory', 'subCategory')
      .where('product.isDeleted = :isDeleted', { isDeleted: false });

    const features = new ApiFeatures(queryBuilder, query || {})
      .filter()
      .sort()
      .paginate();

    const [data, total] = await features.getManyAndCount();

    // Transform file paths to full URLs if request object is provided
    const transformedData = req ? this.transformProductUrls(data, req) : data;

    // Get pagination info from features
    const pagination = features.getPaginationInfo();

    return {
      status: 'success',
      results: transformedData.length,
      total,
      page: pagination.page,
      limit: pagination.limit,
      data: transformedData,
    };
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
    Product.poster = poster;
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
    Product.sizeDetails = dto.sizes.map((size) => ({
      sizeName: size.sizeName,
      price: size.price,
      quantities: size.quantities.map((colorQty) => ({
        colorName: colorQty.colorName,
        quantity: colorQty.quantity,
        imgColors: colorQty.imgColors || '', // Use provided imgColors or empty string
      })),
    }));

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

    // Update files if provided - save to file system
    if (files.images && files.images.length > 0) {
      product.images = await this.saveFiles(
        files.images,
        product.name,
        'images',
      );
    }

    if (files.imgCover && files.imgCover[0]) {
      product.imgCover = await this.saveFile(
        files.imgCover[0],
        product.name,
        'cover',
      );
    }

    if (files.imgSizeChart && files.imgSizeChart[0]) {
      product.imgSizeChart = await this.saveFile(
        files.imgSizeChart[0],
        product.name,
        'sizechart',
      );
    }

    if (files.imgMeasure && files.imgMeasure[0]) {
      product.imgMeasure = await this.saveFile(
        files.imgMeasure[0],
        product.name,
        'measure',
      );
    }

    // Update category and subcategory if provided
    if (dto.categoryId)
      product.category = await this.fetchCategory(dto.categoryId);
    if (dto.subCategoryId && dto.categoryId)
      product.subCategory = await this.fetchSubCategory(
        dto.categoryId,
        dto.subCategoryId,
      );

    // Update size details if provided
    if (dto.sizes && dto.sizes.length > 0) {
      product.sizeDetails = dto.sizes.map((size, index) => ({
        sizeName: size?.sizeName,
        price: size?.price || product.sizeDetails[index].price,
        quantities: size?.quantities
          ? size.quantities.map((q, index) => ({
              colorName: q.colorName,
              quantity:
                q.quantity ||
                product.sizeDetails[index].quantities[index].quantity,
              // imgColors:
              //   q.imgColors ||
              //   product.sizeDetails[index].quantities[index].imgColors,
            }))
          : product.sizeDetails[index].quantities,
      }));
    }

    // Update colors if provided
    if (
      dto.colors &&
      dto.colors.length > 0 &&
      files.imgColors &&
      files.imgColors.length > 0
    ) {
      // Save new color images to file system
      const colorImagePaths = await this.saveFiles(
        files.imgColors,
        product.name,
        'colors',
      );

      product.colors = dto.colors.map((color, index) => ({
        name:
          color.name ||
          (product.colors[index] ? product.colors[index].name : ''),
        imgColor:
          colorImagePaths[index] ||
          (product.colors[index] ? product.colors[index].imgColor : ''),
      }));
    } else if (dto.colors && dto.colors.length > 0) {
      // Update color names but keep existing image paths
      product.colors = dto.colors.map((color, index) => ({
        name:
          color.name ||
          (product.colors[index] ? product.colors[index].name : ''),
        imgColor: product.colors[index] ? product.colors[index].imgColor : '',
      }));
    }

    // The BeforeUpdate hook will automatically update the total quantity
    const updatedProduct = await this.productRepo.save(product);

    // Transform file paths to full URLs if request object is provided
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
  private async fetchCategory(id: number): Promise<category> {
    const cat = await this.categoryRepo.findOne({
      where: { id },
      relations: ['subCategories'],
    });
    if (!cat) throw new NotFoundException(`Category ${id} not found`);

    // Update subCategoryIds
    if (cat.subCategories && cat.subCategories.length > 0) {
      cat.subCategoryIds = cat.subCategories.map((sub) => sub.id);
    } else {
      cat.subCategoryIds = [];
    }
    await this.categoryRepo.save(cat);

    return cat;
  }

  private async fetchSubCategory(
    idCat: number,
    idSub: number,
  ): Promise<subCategory> {
    const sub = await this.subCategoryRepo.findOneBy({
      id: idSub,
      category: { id: idCat },
    });
    if (!sub)
      throw new NotFoundException(
        'SubCategory not found or not exist in this category',
      );
    return sub;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    product.isDeleted = true;
    await this.productRepo.save(product);
    // Delete the entire product directory
    const productPath = `products/${product.name.replace(/\s+/g, '_').toLowerCase()}`;
    this.fileStorageService.deleteDirectory(productPath);
  }

  async findOne(id: number): Promise<product> {
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
}
