import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";

describe("ProductRepository test", () => {

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
    const productProps = {
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    }
    const product = new Product(productProps);

    const productRepository = new ProductRepository();
    await productRepository.add(product);
    const productDb = await ProductModel.findOne({ where: { id: product.id.id } });

    expect(productDb).toBeDefined();
    expect(productDb?.id).toBe(product.id.id);
    expect(productDb?.name).toBe(product.name);
    expect(productDb?.description).toBe(product.description);
    expect(productDb?.purchasePrice).toBe(product.purchasePrice);
    expect(productDb?.stock).toBe(product.stock);
    expect(productDb?.createdAt).toBeDefined();
    expect(productDb?.updatedAt).toBeDefined();
  });

  it("should find a product", async () => {
    const expectedProduct = {
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await ProductModel.create({
      id: expectedProduct.id.id,
      name: expectedProduct.name,
      description: expectedProduct.description,
      purchasePrice: expectedProduct.purchasePrice,
      stock: expectedProduct.stock,
      createdAt: expectedProduct.createdAt,
      updatedAt: expectedProduct.updatedAt,
    });

    const productRepository = new ProductRepository();
    const productDb = await productRepository.find(expectedProduct.id.id);

    expect(productDb).toBeDefined();
    expect(productDb?.id.id).toBe(expectedProduct.id.id);
    expect(productDb?.name).toBe(expectedProduct.name);
    expect(productDb?.description).toBe(expectedProduct.description);
    expect(productDb?.purchasePrice).toBe(expectedProduct.purchasePrice);
    expect(productDb?.stock).toBe(expectedProduct.stock);
    expect(productDb?.createdAt).toBeDefined();
    expect(productDb?.updatedAt).toBeDefined();
  });
});