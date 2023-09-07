import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

const product = ProductFactory.create("Product 1", 10);

const input = {
  id: product.id,
  name: "Product 1 Updated",
  price: 20,
};

describe("Integration test for product update use case", () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("Should update a product", async () => {
    const productRepository = new ProductRepository();
    await productRepository.create(product);

    const useCase = new UpdateProductUseCase(productRepository);
    const result = await useCase.execute(input);

    expect(result).toEqual(input);
  });
});