import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category, SubCategory } from './entities/Category.entity';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { Auth } from 'src/auth/entities/auth.entity';
import { PublishState } from 'src/common/interfaces/entity.interface';

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
    const product = new Product();
    const existingProduct = await this.productRepo.findOne({
      where: { name: dto.name },
    });
    if (existingProduct)
      throw new BadRequestException('Product name already exists');
    product.name = dto.name;
    product.description = dto.description;
    product.category = await this.fetchCategory(dto.categoryId);
    product.subCategory = await this.fetchSubCategory(
      dto.categoryId,
      dto.subCategoryId,
    );
    product.publishState = dto.publishState as PublishState;

    // 2) صور مفردة
    if (files.imgCover) product.imgCover = this.mapFiles(files.imgCover)[0];
    if (files.imgSizeChart)
      product.imgSizeChart = this.mapFiles(files.imgSizeChart)[0];
    if (files.imgMeasure)
      product.imgMeasure = this.mapFiles(files.imgMeasure)[0];
    if (files.images) product.images = this.mapFiles(files.images);
    // 3) الفئات
    product.category = await this.fetchCategory(dto.categoryId);
    product.subCategory = await this.fetchSubCategory(
      dto.categoryId,
      dto.subCategoryId,
    );
    // 4) إجمالي الكمية

    // 5) المنشئ
    product.poster = poster;

    // 6) التفاصيل
    product.sizeDetails = dto.sizes.map((size) => ({
      sizeName: size.sizeName,
      price: size.price,
      quantities: size.quantities.map((colorQty) => ({
        colorName: colorQty.colorName,
        quantity: colorQty.quantity,
      })),
    }));
    if (dto.colors?.length !== files.imgColors?.length) {
      throw new BadRequestException(
        'Number of color images must match number of colors',
      );
    }
    product.colors = (dto.colors || []).map((color, index) => ({
      name: color.name,
      imgColor: files.imgColors?.[index]
        ? this.mapFiles(files.imgColors)[index]
        : '',
    }));

    product.quantity = product.getTotalQuantity();

    return this.productRepo.save(product);
  }

  /** ----------  Update  ---------- */
  async update(
    id: number,
    dto: UpdateProductDto,
    files: UploadFiles = {},
    // poster: Auth,
  ): Promise<Product> {
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
  private async fetchCategory(id: number): Promise<Category> {
    const cat = await this.categoryRepo.findOneBy({ id });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  private async fetchSubCategory(
    idCat: number,
    idSub: number,
  ): Promise<SubCategory> {
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
