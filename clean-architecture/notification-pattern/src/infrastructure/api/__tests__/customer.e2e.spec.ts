import { sequelize, app } from "../express";
import request from "supertest";

describe("E2E test for customer", () => {

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const customer1 = {
    name: "John",
    address: {
      street: "Street",
      city: "City",
      number: 123,
      zip: "12345",
    }
  }

  const customer2 = {
    name: "Jane",
    address: {
      street: "Street",
      city: "City",
      number: 123,
      zip: "12345",
    }
  }

  it("should create a customer", async () => {
    const response = await request(app).post("/customer").send(customer1);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      ...customer1,
    });
  });

  it("should not create a customer", async () => {
    const response = await request(app).post("/customer").send({ name: "John" });

    expect(response.status).toBe(500);
  });

  it("should list all customers", async () => {
    const result1 = await request(app).post("/customer").send(customer1);
    expect(result1.status).toBe(201);
    const result2 = await request(app).post("/customer").send(customer2);
    expect(result2.status).toBe(201);

    const response = await request(app).get("/customer");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ customers: [
      {
        id: expect.any(String),
        ...customer1,
      },
      {
        id: expect.any(String),
        ...customer2,
      },
    ]});
  });
});