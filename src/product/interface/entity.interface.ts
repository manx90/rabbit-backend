export interface ColorWithSizes {
  name: string;
  imgColor: string;
  sizes: SizeQuantity[];
}

interface SizeQuantity {
  size: string;
  quantity: number;
}
