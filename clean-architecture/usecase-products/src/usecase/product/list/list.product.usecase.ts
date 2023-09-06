import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { OutputListProductDto } from "./list.product.dto";

export default class ListProductUseCase {
  private ProductRepository: ProductRepositoryInterface;
  constructor(productRepository: ProductRepositoryInterface) {
    this.ProductRepository = productRepository;
  }

  async execute(): Promise<OutputListProductDto> {
    const products = await this.ProductRepository.findAll();
    return this.toOutput(products);
  }

  public toOutput(products: Product[]): OutputListProductDto {
    return {
      products: products.map((product) => {
        return {
          id: product.id,
          name: product.name,
          price: product.price,
        };
      }),
    };
  }
}