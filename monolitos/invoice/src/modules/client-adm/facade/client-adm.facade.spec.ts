import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.respository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeFactory from "../factory/facade.factory";

describe("ClientFacade test", () => {
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

  it("should create a client", async () => {
    const facade = ClientAdmFacadeFactory.create();
    const input = {
      id: "1",
      name: "Client 1",
      email: "email",
      address: "address",
    };

    await facade.add(input);

    const client = await ClientModel.findByPk(input.id);

    expect(client?.id).toBe(input.id);
    expect(client?.name).toBe(input.name);
    expect(client?.email).toBe(input.email);
    expect(client?.address).toBe(input.address);
    expect(client?.createdAt).toBeDefined();
    expect(client?.updatedAt).toBeDefined();
  });

  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();
    const client = await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "email",
      address: "address",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const input = {
      id: client.id,
    };

    const result = await facade.find(input);

    expect(result.id).toBe(client.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.address).toBe(client.address);
  });
});