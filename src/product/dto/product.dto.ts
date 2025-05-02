export class CreateProductDto {
  name: string;
  description: string;
  price: number = 0; // Add a default value to the price property
  Quantity: number;
  imageCover: string;
  images?: string[];
  imageSize: string;
  imageTypes: string;
  category: string;
  subCategory: string;
  isActive: boolean;
  PosterId: number;
}
export class UpdateProductDto {
  name: string;
  description: string;
  price: number;
  Quantity: number;
  imageCover: string;
  images: string[];
  imageSize: string;
  imageTypes: string;
  category: string;
  subCategory: string;
  isActive: boolean;
  PosterId: number;
}
