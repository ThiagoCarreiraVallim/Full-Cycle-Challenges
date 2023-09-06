import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";

describe("Integration test for product find use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should create a product", async () => {
    const input = {
      name: 'Product 1',
      price: 10,
    };

    const productRepository = new ProductRepository();

    const useCase = new CreateProductUseCase(productRepository);


    const expectedResult = {
      id: expect.any(String),
      name: 'Product 1',
      price: 10,
    };

    const result = await useCase.execute(input);

    expect(result).toStrictEqual(expectedResult);
  });
});