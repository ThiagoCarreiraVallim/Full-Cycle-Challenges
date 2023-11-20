export interface ProcessPaymentInputDto {
  amount: number;
  orderId: string;
}

export interface ProcessPaymentOutputDto {
  transactionId: string;
  status: string;
  amount: number;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}