import ProductGetaWay from "../../gateway/product.gateway";
import { CheckStockInputDTO, CheckStockOutputDTO } from "./check-stock.dto";

export default class CheckStockUseCase {
  constructor(private productGateway: ProductGetaWay) {}

  async execute(input: CheckStockInputDTO): Promise<CheckStockOutputDTO> {
    const product = await this.productGateway.find(input.productId);

    return {
      productId: product.id.id,
      stock: product.stock,
    }
  }
}