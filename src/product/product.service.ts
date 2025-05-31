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
  ) {}

  /** Convert uploaded files to Base64 strings */
  private mapFiles(files: Express.Multer.File[] = []) {
    return files.map((f) => f.buffer.toString('base64').slice(0, 40));
  }

  /** ----------  Create  ---------- */
  async getAllProducts(query: Request['query']) {
    const queryBuilder = this.productRepo.createQueryBuilder('product');

    // Use ApiFeatures
    const features = new ApiFeatures<product>(queryBuilder, query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Get results with total count
    const [products, total] = await features.getManyAndCount();

    return {
      status: 'success',
      results: products.length,
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      data: products,
    };
  }

  async create(
    dto: CreateProductDto,
    files: UploadFiles = {},
    poster: auth,
  ): Promise<any> {
    // 1) بناء الكيان الأساسي
    const Product = new product();
    const existingProduct = await this.productRepo.findOne({
      where: { name: dto.name },
    });
    if (existingProduct)
      throw new BadRequestException('Product name already exists');
    Product.name = dto.name;
    Product.description = dto.description;
    Product.category = await this.fetchCategory(dto.categoryId);
    Product.subCategory = await this.fetchSubCategory(
      dto.categoryId,
      dto.subCategoryId,
    );
    Product.publishState = dto.publishState as PublishState;

    // 2) صور مفردة
    if (files.imgCover) Product.imgCover = this.mapFiles(files.imgCover)[0];
    if (files.imgSizeChart)
      Product.imgSizeChart = this.mapFiles(files.imgSizeChart)[0];
    if (files.imgMeasure)
      Product.imgMeasure = this.mapFiles(files.imgMeasure)[0];
    if (files.images) Product.images = this.mapFiles(files.images);
    // 3) الفئات
    Product.category = await this.fetchCategory(dto.categoryId);
    Product.subCategory = await this.fetchSubCategory(
      dto.categoryId,
      dto.subCategoryId,
    );
    // 4) إجمالي الكمية

    // 5) المنشئ
    Product.poster = poster;

    // 6) التفاصيل
    Product.sizeDetails = dto.sizes.map((size) => ({
      sizeName: size.sizeName,
      price: size.price,
      quantities: size.quantities.map((colorQty) => ({
        colorName: colorQty.colorName,
        quantity: colorQty.quantity,
        imgColors: '', // assign empty string to satisfy the required property
      })),
    }));
    if (dto.colors?.length !== files.imgColors?.length) {
      throw new BadRequestException(
        'Number of color images must match number of colors',
      );
    }
    Product.colors = (dto.colors || []).map((color, index) => ({
      name: color.name,
      imgColor: files.imgColors?.[index]
        ? this.mapFiles(files.imgColors)[index]
        : '',
    }));

    Product.quantity = Product.getTotalQuantity();

    return this.productRepo.save(Product);
  }

  /** ----------  Update  ---------- */
  async update(
    id: number,
    dto: UpdateProductDto,
    files: UploadFiles = {},
    // poster: Auth,
  ): Promise<product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'poster'],
    });
    if (!product) throw new NotFoundException('Product not found');

    // دمج التغييرات
    Object.assign(product, dto);

    if (files.images) product.images = this.mapFiles(files.images);
    if (files.imgCover) product.imgCover = this.mapFiles(files.imgCover)[0];
    if (files.imgSizeChart)
      product.imgSizeChart = this.mapFiles(files.imgSizeChart)[0];
    if (files.imgMeasure)
      product.imgMeasure = this.mapFiles(files.imgMeasure)[0];

    if (dto.categoryId)
      product.category = await this.fetchCategory(dto.categoryId);
    if (dto.subCategoryId && dto.categoryId)
      product.subCategory = await this.fetchSubCategory(
        dto.categoryId,
        dto.subCategoryId,
      );

    product.quantity = product.getTotalQuantity();

    return this.productRepo.save(product);
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

  /** ----------  Soft-Delete  ---------- */
  async remove(id: number): Promise<void> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    product.isDeleted = true;
    await this.productRepo.save(product);
  }

  /** ----------  Queries  ---------- */
  async findOne(id: number): Promise<product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'poster'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findAll(): Promise<product[]> {
    return this.productRepo.find({ relations: ['category', 'subCategory'] });
  }
}
