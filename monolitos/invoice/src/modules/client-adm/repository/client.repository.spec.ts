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
      address: "Address 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new ClientRepository();
    const result = await repository.find(client.id);

    expect(result.id.id).toBe(client.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.address).toBe(client.address);
    expect(result.createdAt).toStrictEqual(client.createdAt);
    expect(result.updatedAt).toStrictEqual(client.updatedAt);
  });

  it("should add a client", async () => {
    const repository = new ClientRepository();
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "email",
      address: "address",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await repository.add(client);

    const result = await ClientModel.findByPk(client.id.id);

    expect(result?.id).toBe(client.id.id);
    expect(result?.name).toBe(client.name);
    expect(result?.email).toBe(client.email);
    expect(result?.address).toBe(client.address);
    expect(result?.createdAt).toStrictEqual(client.createdAt);
    expect(result?.updatedAt).toStrictEqual(client.updatedAt);
  });
});
