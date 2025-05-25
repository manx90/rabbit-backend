import { Product } from '../../product/entities/product.entity';

export interface ErrorResponse {
  statusCode: number;
  message: string;
}
export interface ProductResponse
  extends Omit<
    Product,
    'images' | 'imgCover' | 'imgSize' | 'imgMeasure' | 'colorsWithSizes'
  > {
  images: string[];
  imgCover?: string;
  imgSize?: string;
  imgMeasure?: string;
  colorsWithSizes: ColorWithSizes[];
}

interface SizeQuantity {
  size: string;
  quantity: number;
}

interface ColorWithSizes {
  name: string;
  imgColor: string;
  sizes: SizeQuantity[];
}
