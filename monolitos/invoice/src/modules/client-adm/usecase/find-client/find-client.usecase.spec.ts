import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "name",
  email: "email",
  address: "address",
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockResolvedValue(client),
  }
}

describe("find a client usecase unit test", () => {
  it("should find a client", async () => {
    const repository = MockRepository();
    const usecase = new FindClientUseCase(repository);

    const input = {
      id: "1",
    }

    const client = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(client.id).toBe("1");
    expect(client.name).toBe("name");
    expect(client.email).toBe("email");
    expect(client.address).toBe("address");
  });
});
