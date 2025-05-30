export enum PublishState {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export interface ColorQuantity {
  colorName: string;
  quantity: number;
}

export interface SizeDetail {
  sizeName: string;
  price: number;
  quantities: ColorQuantity[];
}
export interface ColorDetail {
  name: string;
  imgColor?: string;
}
export interface ProductFlags {
  isActive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  isBestSeller: boolean;
}
export interface ProductImages {
  gallery: string[] | null;
  cover: string | null;
  sizeChart: string | null;
  measure: string | null;
}
export interface PosterInfo {
  id: number;
  fullName: string;
}
