import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductAdmFacade from "./product-adm.facade";
import ProductAdmFacadeFactory from "../factory/facade.factory";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ProductAdmFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ProductModel]);
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productFacade = ProductAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };

    await productFacade.addProduct(input);

    const productDb = await ProductModel.findOne({ where: { id: input.id } });

    expect(productDb).toBeDefined();
    expect(productDb?.id).toBe(input.id);
    expect(productDb?.name).toBe(input.name);
    expect(productDb?.description).toBe(input.description);
    expect(productDb?.purchasePrice).toBe(input.purchasePrice);
    expect(productDb?.stock).toBe(input.stock);
    expect(productDb?.createdAt).toBeDefined();
    expect(productDb?.updatedAt).toBeDefined();
  });

  it("should get stock of a product", async () => {
    const productFacade = ProductAdmFacadeFactory.create();

    const product = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    });

    await ProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });

    const result = await productFacade.checkStock({ productId: product.id.id});

    expect(result.productId).toBe(product.id.id);
    expect(result.stock).toBe(product.stock);
  });
});