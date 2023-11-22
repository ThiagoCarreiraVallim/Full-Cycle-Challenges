export interface CheckStockInputDTO {
  productId: string;
}

export interface CheckStockOutputDTO {
  productId: string;
  stock: number;
}
