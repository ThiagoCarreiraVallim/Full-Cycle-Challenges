export interface PlaceOrderFacadeInputDto {
  clientId: string;
  products: {
    productId: string;
  }[];
}

export interface PlaceOrderFacadeOutputDto {
  id: string;
  invoiceId: string | null;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];
}

export default interface CheckoutFacadeInterface {
  placeOrder(order: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>;
}