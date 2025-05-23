export interface ColorWithSizes {
  SizeName: string;
  Price: string;
  QuantityColor: [
    {
      ColorName: ColorAndImage.name;
      Quantity: number;
    },
  ];
}

interface ColorAndImage {
  name: string;
  imgColor: string;
}
// interface SizeQuantity {
//   size: string;
//   quantity: number;
// }
