import { Season } from '../entities/product.entity';
import { PublishState } from 'src/common/interfaces/entity.interface';

export class PublishStateStatsDto {
  published: number;
  draft: number;
  total: number;
}

export class SeasonStatsDto {
  winter: number;
  summer: number;
  spring_autumn: number;
  all: number;
  total: number;
}

export class FlagStatsDto {
  featured: number;
  trending: number;
  new: number;
  bestSeller: number;
  deleted: number;
}

export class RecentStatsDto {
  last7Days: number;
  last30Days: number;
  last90Days: number;
}

export class RecentChangeDto {
  current: number;
  previous: number;
  percentChange: number; // positive means increase, negative decrease
}

export class CategoryStatsDto {
  categoryId: number;
  categoryName: string;
  count: number;
}

export class SubCategoryStatsDto {
  subCategoryId: number;
  subCategoryName: string;
  categoryName: string;
  count: number;
}

export class TopSellingProductDto {
  id: number;
  name: string;
  sales: number;
  totalQuantity: number;
}

export class LowStockProductDto {
  id: number;
  name: string;
  quantity: number;
  season: Season;
}

export class ProductWithoutImagesDto {
  id: number;
  name: string;
  hasCover: boolean;
  hasImages: boolean;
  hasSizeChart: boolean;
  hasMeasure: boolean;
}

export class CreatorStatsDto {
  posterId: string;
  username: string;
  count: number;
}

export class ScheduledProductDto {
  id: number;
  name: string;
  datePublished: Date;
  publishState: PublishState;
}

export class SalesByCategoryDto {
  categoryId: number;
  categoryName: string;
  totalSales: number;
  productCount: number;
}

export class BestSellingProductDto {
  id: number;
  name: string;
  sales: number;
}

export class SalesStatsDto {
  totalSales: number;
  totalRevenue: number;
  averageSalesPerProduct: number;
  bestSellingProduct: BestSellingProductDto | null;
  salesByCategory: SalesByCategoryDto[];
}

export class ComprehensiveStatsDto {
  totalProducts: number;
  publishStateStats: PublishStateStatsDto;
  seasonStats: SeasonStatsDto;
  flagStats: FlagStatsDto;
  recentStats: RecentStatsDto;
  categoryStats: CategoryStatsDto[];
  topSelling: TopSellingProductDto[];
  lowStock: LowStockProductDto[];
  missingImages: number;
  salesStats: SalesStatsDto;
}

export class DateRangeStatsDto {
  startDate: Date;
  endDate: Date;
  count: number;
  message: string;
}

export class RecentDaysStatsDto {
  days: number;
  count: number;
  message: string;
}

export class TotalProductsDto {
  totalProducts: number;
}
