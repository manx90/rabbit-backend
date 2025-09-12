/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublishState } from 'src/common/interfaces/entity.interface';
import { Repository, Between } from 'typeorm';
import { product, Season } from './entities/product.entity';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(product)
    private readonly productRepo: Repository<product>,
  ) {}

  async UpdateStatus(id: number): Promise<product> {
    const prod = await this.productRepo.findOne({ where: { id } });
    if (!prod) {
      throw new Error('Product not found');
    }
    console.log('Current publishState:', prod.publishState);
    if (prod.publishState === PublishState.PUBLISHED) {
      prod.publishState = PublishState.DRAFT;
    } else {
      prod.publishState = PublishState.PUBLISHED;
    }
    // Set flag to indicate this is a manual state change (only if column exists)
    if (prod.hasOwnProperty('isManualPublishState')) {
      prod.isManualPublishState = true;
    }
    console.log('New publishState:', prod.publishState);
    await this.productRepo.save(prod);
    return prod;
  }

  async ShowSeason(season: any): Promise<number> {
    // Find all products with the given season
    const products = await this.productRepo.find({ where: { season: season } });
    if (!products || products.length === 0) {
      return 0;
    }
    for (const prod of products) {
      prod.publishState = PublishState.PUBLISHED;
      if (prod.hasOwnProperty('isManualPublishState')) {
        prod.isManualPublishState = true;
      }
      const newProd = await this.productRepo.save(prod);
      console.log(newProd);
    }
    return products.length;
  }
  async HiddenSeason(season: any): Promise<number> {
    // Find all products with the given season
    const products = await this.productRepo.find({ where: { season: season } });
    if (!products || products.length === 0) {
      return 0;
    }
    for (const prod of products) {
      prod.publishState = PublishState.DRAFT;
      if (prod.hasOwnProperty('isManualPublishState')) {
        prod.isManualPublishState = true;
      }
      await this.productRepo.save(prod);
    }
    return products.length;
  }

  // ========== STATISTICS FUNCTIONS ==========

  /**
   * Get total count of all products
   */
  async getTotalProductsCount(): Promise<number> {
    return await this.productRepo.count();
  }

  /**
   * Get count of products by publish state
   */
  async getProductsCountByPublishState(): Promise<{
    published: number;
    draft: number;
    total: number;
  }> {
    const [published, draft, total] = await Promise.all([
      this.productRepo.count({
        where: { publishState: PublishState.PUBLISHED },
      }),
      this.productRepo.count({ where: { publishState: PublishState.DRAFT } }),
      this.productRepo.count(),
    ]);

    return { published, draft, total };
  }

  /**
   * Get count of products by season
   */
  async getProductsCountBySeason(): Promise<{
    winter: number;
    summer: number;
    spring_autumn: number;
    all: number;
    total: number;
  }> {
    const [winter, summer, spring_autumn, all, total] = await Promise.all([
      this.productRepo.count({ where: { season: Season.winter } }),
      this.productRepo.count({ where: { season: Season.summer } }),
      this.productRepo.count({ where: { season: Season.spring_autumn } }),
      this.productRepo.count({ where: { season: Season.all } }),
      this.productRepo.count(),
    ]);

    return { winter, summer, spring_autumn, all, total };
  }

  /**
   * Get count of products by special flags
   */
  async getProductsCountByFlags(): Promise<{
    featured: number;
    trending: number;
    new: number;
    bestSeller: number;
    deleted: number;
  }> {
    const [featured, trending, newProducts, bestSeller, deleted] =
      await Promise.all([
        this.productRepo.count({ where: { isFeatured: true } }),
        this.productRepo.count({ where: { isTrending: true } }),
        this.productRepo.count({ where: { isNew: true } }),
        this.productRepo.count({ where: { isBestSeller: true } }),
        this.productRepo.count({ where: { isDeleted: true } }),
      ]);

    return { featured, trending, new: newProducts, bestSeller, deleted };
  }

  /**
   * Get products created in the last N days
   */
  async getProductsCreatedInLastDays(days: number = 30): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.productRepo.count({
      where: {
        createdAt: Between(startDate, new Date()),
      },
    });
  }

  /**
   * Get products created by date range
   */
  async getProductsCreatedInDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.productRepo.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });
  }

  /**
   * Get products count by category
   */
  async getProductsCountByCategory(): Promise<
    Array<{
      categoryId: number;
      categoryName: string;
      count: number;
    }>
  > {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(product.id)', 'count')
      .groupBy('category.id, category.name')
      .getRawMany();

    return result.map((row: any) => ({
      categoryId: parseInt(row.categoryId),
      categoryName: row.categoryName || 'No Category',
      count: parseInt(row.count),
    }));
  }

  /**
   * Get products count by subcategory
   */
  async getProductsCountBySubCategory(): Promise<
    Array<{
      subCategoryId: number;
      subCategoryName: string;
      categoryName: string;
      count: number;
    }>
  > {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.subCategory', 'subCategory')
      .leftJoin('product.category', 'category')
      .select('subCategory.id', 'subCategoryId')
      .addSelect('subCategory.name', 'subCategoryName')
      .addSelect('category.name', 'categoryName')
      .addSelect('COUNT(product.id)', 'count')
      .groupBy('subCategory.id, subCategory.name, category.name')
      .getRawMany();

    return result.map((row: any) => ({
      subCategoryId: parseInt(row.subCategoryId),
      subCategoryName: row.subCategoryName || 'No SubCategory',
      categoryName: row.categoryName || 'No Category',
      count: parseInt(row.count),
    }));
  }

  /**
   * Get top selling products (by sales count)
   */
  async getTopSellingProducts(limit: number = 10): Promise<
    Array<{
      id: number;
      name: string;
      sales: number;
      totalQuantity: number;
    }>
  > {
    const products = await this.productRepo.find({
      select: ['id', 'name', 'sales', 'quantity'],
      order: { sales: 'DESC' },
      take: limit,
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      sales: product.sales,
      totalQuantity: product.quantity,
    }));
  }

  /**
   * Get products with low stock (quantity < threshold)
   */
  async getLowStockProducts(threshold: number = 10): Promise<
    Array<{
      id: number;
      name: string;
      quantity: number;
      season: Season;
    }>
  > {
    const products = await this.productRepo.find({
      select: ['id', 'name', 'quantity', 'season'],
      where: {
        quantity: Between(0, threshold),
        isDeleted: false,
      },
      order: { quantity: 'ASC' },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      season: product.season,
    }));
  }

  /**
   * Get products without images
   */
  async getProductsWithoutImages(): Promise<
    Array<{
      id: number;
      name: string;
      hasCover: boolean;
      hasImages: boolean;
      hasSizeChart: boolean;
      hasMeasure: boolean;
    }>
  > {
    const products = await this.productRepo.find({
      select: [
        'id',
        'name',
        'imgCover',
        'images',
        'imgSizeChart',
        'imgMeasure',
      ],
    });

    return products
      .filter(
        (product) =>
          !product.imgCover ||
          !product.images ||
          product.images.length === 0 ||
          !product.imgSizeChart ||
          !product.imgMeasure,
      )
      .map((product) => ({
        id: product.id,
        name: product.name,
        hasCover: !!product.imgCover,
        hasImages: !!(product.images && product.images.length > 0),
        hasSizeChart: !!product.imgSizeChart,
        hasMeasure: !!product.imgMeasure,
      }));
  }

  /**
   * Get average sales per product
   */
  async getAverageSalesPerProduct(): Promise<{
    averageSalesPerProduct: number;
    totalProducts: number;
    totalSales: number;
  }> {
    const [totalProducts, totalSalesRaw] = await Promise.all([
      this.getTotalProductsCount(),
      this.productRepo
        .createQueryBuilder('product')
        .select('SUM(product.sales)', 'totalSales')
        .getRawOne(),
    ]);

    const totalSales = parseInt(totalSalesRaw?.totalSales || '0');
    const average = totalProducts > 0 ? totalSales / totalProducts : 0;
    return {
      averageSalesPerProduct: Math.round(average * 100) / 100,
      totalProducts,
      totalSales,
    };
  }
  /**
   * Get comprehensive product statistics
   */
  async getComprehensiveStats(): Promise<{
    totalProducts: number;
    publishStateStats: {
      published: number;
      draft: number;
      total: number;
    };
    seasonStats: {
      winter: number;
      summer: number;
      spring_autumn: number;
      all: number;
      total: number;
    };
    flagStats: {
      featured: number;
      trending: number;
      new: number;
      bestSeller: number;
      deleted: number;
    };
    recentStats: {
      last7Days: number;
      last30Days: number;
      last90Days: number;
    };
    recentChange: {
      last7Days: { current: number; previous: number; percentChange: number };
      last30Days: { current: number; previous: number; percentChange: number };
      last90Days: { current: number; previous: number; percentChange: number };
    };
    categoryStats: Array<{
      categoryId: number;
      categoryName: string;
      count: number;
    }>;
    topSelling: Array<{
      id: number;
      name: string;
      sales: number;
      totalQuantity: number;
    }>;
    lowStock: Array<{
      id: number;
      name: string;
      quantity: number;
      season: Season;
    }>;
    missingImages: number;
    salesStats: {
      totalSales: number;
      totalRevenue: number;
      averageSalesPerProduct: number;
      bestSellingProduct: {
        id: number;
        name: string;
        sales: number;
      } | null;
      salesByCategory: Array<{
        categoryId: number;
        categoryName: string;
        totalSales: number;
        productCount: number;
      }>;
    };
  }> {
    const [
      totalProducts,
      publishStateStats,
      seasonStats,
      flagStats,
      last7Days,
      last30Days,
      last90Days,
      categoryStats,
      topSelling,
      lowStock,
      productsWithoutImages,
      salesStats,
    ] = await Promise.all([
      this.getTotalProductsCount(),
      this.getProductsCountByPublishState(),
      this.getProductsCountBySeason(),
      this.getProductsCountByFlags(),
      this.getProductsCreatedInLastDays(7),
      this.getProductsCreatedInLastDays(30),
      this.getProductsCreatedInLastDays(90),
      this.getProductsCountByCategory(),
      this.getTopSellingProducts(5),
      this.getLowStockProducts(10),
      this.getProductsWithoutImages(),
      this.getSalesStatistics(),
    ]);

    return {
      totalProducts,
      publishStateStats,
      seasonStats,
      flagStats,
      recentStats: {
        last7Days,
        last30Days,
        last90Days,
      },
      categoryStats,
      topSelling,
      lowStock,
      missingImages: productsWithoutImages.length,
      salesStats,
      recentChange: {
        last7Days: await this.getPeriodChange(7),
        last30Days: await this.getPeriodChange(30),
        last90Days: await this.getPeriodChange(90),
      },
    };
  }

  private async getPeriodChange(days: number): Promise<{
    current: number;
    previous: number;
    percentChange: number;
  }> {
    const now = new Date();
    const startCurrent = new Date();
    startCurrent.setDate(now.getDate() - days);
    const startPrevious = new Date();
    startPrevious.setDate(startCurrent.getDate() - days);

    const [current, previous] = await Promise.all([
      this.productRepo.count({
        where: { createdAt: Between(startCurrent, now) },
      }),
      this.productRepo.count({
        where: { createdAt: Between(startPrevious, startCurrent) },
      }),
    ]);

    const percentChange =
      previous === 0
        ? current > 0
          ? 100
          : 0
        : ((current - previous) / previous) * 100;

    return {
      current,
      previous,
      percentChange: Math.round(percentChange * 100) / 100,
    };
  }

  /**
   * Get products count by creator (poster)
   */
  async getProductsCountByCreator(): Promise<
    Array<{
      posterId: string;
      username: string;
      count: number;
    }>
  > {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.poster', 'auth')
      .select('auth.id', 'posterId')
      .addSelect('auth.username', 'username')
      .addSelect('COUNT(product.id)', 'count')
      .groupBy('auth.id, auth.username')
      .getRawMany();

    return result.map((row: any) => ({
      posterId: row.posterId || 'Unknown',
      username: row.username || 'Unknown User',
      count: parseInt(row.count),
    }));
  }

  /**
   * Get products with scheduled publishing
   */
  async getScheduledProducts(): Promise<
    Array<{
      id: number;
      name: string;
      datePublished: Date;
      publishState: PublishState;
    }>
  > {
    const products = await this.productRepo.find({
      select: ['id', 'name', 'datePublished', 'publishState'],
      where: {
        datePublished: Between(
          new Date(),
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        ), // Next year
      },
      order: { datePublished: 'ASC' },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      datePublished: product.datePublished,
      publishState: product.publishState,
    }));
  }

  /**
   * Get comprehensive sales statistics
   */
  async getSalesStatistics(): Promise<{
    totalSales: number;
    totalRevenue: number;
    averageSalesPerProduct: number;
    bestSellingProduct: {
      id: number;
      name: string;
      sales: number;
    } | null;
    salesByCategory: Array<{
      categoryId: number;
      categoryName: string;
      totalSales: number;
      productCount: number;
    }>;
  }> {
    // Get total sales across all products
    const totalSalesResult = await this.productRepo
      .createQueryBuilder('product')
      .select('SUM(product.sales)', 'totalSales')
      .getRawOne();

    const totalSales = parseInt(totalSalesResult?.totalSales || '0');

    // Get total revenue by estimating unit price from sizeDetails (no product.price column)
    // Strategy: for each product, compute the average price across its sizes, then multiply by sales
    const productsForRevenue = await this.productRepo.find({
      select: ['id', 'sales', 'sizeDetails'],
    });

    const totalRevenue = productsForRevenue.reduce((sum, p) => {
      const sizes = Array.isArray((p as any).sizeDetails)
        ? (p as any).sizeDetails
        : [];
      if (sizes.length === 0 || typeof p.sales !== 'number' || p.sales <= 0)
        return sum;
      const priceValues = sizes
        .map((s: any) =>
          typeof s?.price === 'number' ? s.price : Number(s?.price),
        )
        .filter((v: any) => Number.isFinite(v));
      if (priceValues.length === 0) return sum;
      const avgPrice =
        priceValues.reduce((a: number, b: number) => a + b, 0) /
        priceValues.length;
      return sum + avgPrice * p.sales;
    }, 0);

    // Get total products count for average calculation
    const totalProducts = await this.getTotalProductsCount();
    const averageSalesPerProduct =
      totalProducts > 0 ? totalSales / totalProducts : 0;

    // Get best selling product
    const bestSellingProduct = await this.productRepo.findOne({
      select: ['id', 'name', 'sales'],
      where: { sales: Between(1, 999999) }, // Products with at least 1 sale
      order: { sales: 'DESC' },
    });

    // Get sales by category
    const salesByCategoryResult = await this.productRepo
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select('category.id', 'categoryId')
      .addSelect('category.name', 'categoryName')
      .addSelect('SUM(product.sales)', 'totalSales')
      .addSelect('COUNT(product.id)', 'productCount')
      .where('product.sales > 0')
      .groupBy('category.id, category.name')
      .orderBy('totalSales', 'DESC')
      .getRawMany();

    const salesByCategory = salesByCategoryResult.map((row: any) => ({
      categoryId: parseInt(row.categoryId || '0'),
      categoryName: row.categoryName || 'Uncategorized',
      totalSales: parseInt(row.totalSales || '0'),
      productCount: parseInt(row.productCount || '0'),
    }));

    return {
      totalSales,
      totalRevenue,
      averageSalesPerProduct: Math.round(averageSalesPerProduct * 100) / 100, // Round to 2 decimal places
      bestSellingProduct: bestSellingProduct
        ? {
            id: bestSellingProduct.id,
            name: bestSellingProduct.name,
            sales: bestSellingProduct.sales,
          }
        : null,
      salesByCategory,
    };
  }
}
