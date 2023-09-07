import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";

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

  it("Should find a product", async () => {
    const product = ProductFactory.create("Product", 10);
    const repository = new ProductRepository();
    await repository.create(product);

    const useCase = new FindProductUseCase(repository);

    const input = {
      id: product.id,
    };

    const expectedResult = {
      id: product.id,
      name: product.name,
      price: product.price,
    };

    const result = await useCase.execute(input);

    expect(result).toStrictEqual(expectedResult);
  });
});