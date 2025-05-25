import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category, SubCategory } from './entities/Category.entity';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { Auth } from 'src/auth/entities/auth.entity';

interface UploadFiles {
  images?: Express.Multer.File[];
  imgCover?: Express.Multer.File[];
  imgSizeChart?: Express.Multer.File[];
  imgMeasure?: Express.Multer.File[];
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepo: Repository<SubCategory>,
  ) {}

  /** Convert uploaded files to Base64 strings */
  private mapFiles(files: Express.Multer.File[] = []): string[] {
    return files.map((f) => f.buffer.toString('base64'));
  }

  /** ----------  Create  ---------- */
  async create(
    dto: CreateProductDto,
    files: UploadFiles = {},
    poster: Auth,
  ): Promise<Product> {
    // 1) بناء الكيان الأساسي
    const product = this.productRepo.create({
      name: dto.name,
      description: dto.description,
      publishState: dto.publishState,
      sizeDetails: dto.sizes,
      isFeatured: dto.isFeatured,
      isTrending: dto.isTrending,
      isNew: dto.isNew,
      isBestSeller: dto.isBestSeller,
      // images قد تكون undefined؛ نحولها لمصفوفة فاضية
      images: files.images ? this.mapFiles(files.images) : [],
      poster,
    });

    // 2) صور مفردة
    if (files.imgCover?.[0])
      product.imgCover = files.imgCover[0].buffer.toString('base64');
    if (files.imgSizeChart?.[0])
      product.imgSizeChart = files.imgSizeChart[0].buffer.toString('base64');
    if (files.imgMeasure?.[0])
      product.imgMeasure = files.imgMeasure[0].buffer.toString('base64');

    // 3) الفئات
    product.category = await this.fetchCategory(dto.categoryId);
    product.subCategory = await this.fetchSubCategory(dto.subCategoryId);

    // 4) إجمالي الكمية
    product.quantity = product.getTotalQuantity();

    return this.productRepo.save(product);
  }

  /** ----------  Update  ---------- */
  async update(
    id: number,
    dto: UpdateProductDto,
    files: UploadFiles = {},
  ): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'poster'],
    });
    if (!product) throw new NotFoundException('Product not found');

    // دمج التغييرات
    Object.assign(product, dto);

    if (files.images) product.images = this.mapFiles(files.images);
    if (files.imgCover?.[0])
      product.imgCover = files.imgCover[0].buffer.toString('base64');
    if (files.imgSizeChart?.[0])
      product.imgSizeChart = files.imgSizeChart[0].buffer.toString('base64');
    if (files.imgMeasure?.[0])
      product.imgMeasure = files.imgMeasure[0].buffer.toString('base64');

    if (dto.categoryId)
      product.category = await this.fetchCategory(dto.categoryId);
    if (dto.subCategoryId)
      product.subCategory = await this.fetchSubCategory(dto.subCategoryId);

    product.quantity = product.getTotalQuantity();

    return this.productRepo.save(product);
  }

  /** ----------  Helpers  ---------- */
  private async fetchCategory(id: number): Promise<Category> {
    const cat = await this.categoryRepo.findOneBy({ id });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  private async fetchSubCategory(id: number): Promise<SubCategory> {
    const sub = await this.subCategoryRepo.findOneBy({ id });
    if (!sub) throw new NotFoundException('SubCategory not found');
    return sub;
  }

  /** ----------  Soft-Delete  ---------- */
  async remove(id: number): Promise<void> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    product.isDeleted = true;
    await this.productRepo.save(product);
  }

  /** ----------  Queries  ---------- */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'poster'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({ relations: ['category', 'subCategory'] });
  }
}
