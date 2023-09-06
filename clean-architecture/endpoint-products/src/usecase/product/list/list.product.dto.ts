export interface InputListProductDto {}

interface ProductDto {
  id: string;
  name: string;
  price: number;
}

export interface OutputListProductDto {
  products: ProductDto[];
}