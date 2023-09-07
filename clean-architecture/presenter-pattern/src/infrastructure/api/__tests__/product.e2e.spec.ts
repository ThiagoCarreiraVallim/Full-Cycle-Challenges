import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const product1 = {
    name: "Product 1",
    price: 10,
  }
  
  const product2 = {
    name: "Product 2",
    price: 20,
  }

  it("should list all products", async () => {
    const result1 = await request(app).post("/product").send(product1);
    expect(result1.status).toBe(201);
    const result2 = await request(app).post("/product").send(product2);
    expect(result2.status).toBe(201);

    const response = await request(app).get("/product");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ products: [
      {
        id: expect.any(String),
        ...product1,
      },
      {
        id: expect.any(String),
        ...product2,
      },
    ] });
  });
});