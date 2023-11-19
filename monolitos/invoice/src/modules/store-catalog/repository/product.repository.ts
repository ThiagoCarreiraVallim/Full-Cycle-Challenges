import ProductGateway from "../gateway/product.gateway";
import ProductEntity from "../domain/product.entity";
import ProductModel from "./product.model";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class ProductRepository implements ProductGateway {
  async findAll(): Promise<ProductEntity[]> {
    const products = await ProductModel.findAll();

    return products.map((product) => {
      return new ProductEntity({
        id: new Id(product.id),
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      });
    });
  }

  async find(id: string): Promise<ProductEntity> {
    const product = await ProductModel.findByPk(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return new ProductEntity({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}