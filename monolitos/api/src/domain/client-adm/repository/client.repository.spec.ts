import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.respository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ClientRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([ClientModel]);
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a client", async () => {
    const client = await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "email@email.com",
      document: "123456789",
      street: "street",
      number: "1",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "12345678",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new ClientRepository();
    const result = await repository.find(client.id);

    expect(result.id.id).toBe(client.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.document).toBe(client.document);
    expect(result.street).toBe(client.street);
    expect(result.number).toBe(client.number);
    expect(result.complement).toBe(client.complement);
    expect(result.city).toBe(client.city);
    expect(result.state).toBe(client.state);
    expect(result.zipCode).toBe(client.zipCode);
    expect(result.createdAt).toStrictEqual(client.createdAt);
    expect(result.updatedAt).toStrictEqual(client.updatedAt);
  });

  it("should add a client", async () => {
    const repository = new ClientRepository();
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "email",
      document: "123456789",
      street: "street",
      number: "1",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "12345678",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await repository.add(client);

    const result = await ClientModel.findByPk(client.id.id);

    expect(result?.id).toBe(client.id.id);
    expect(result?.name).toBe(client.name);
    expect(result?.email).toBe(client.email);
    expect(result?.document).toBe(client.document);
    expect(result?.street).toBe(client.street);
    expect(result?.number).toBe(client.number);
    expect(result?.complement).toBe(client.complement);
    expect(result?.city).toBe(client.city);
    expect(result?.state).toBe(client.state);
    expect(result?.zipCode).toBe(client.zipCode);
    expect(result?.createdAt).toStrictEqual(client.createdAt);
    expect(result?.updatedAt).toStrictEqual(client.updatedAt);
  });
});
