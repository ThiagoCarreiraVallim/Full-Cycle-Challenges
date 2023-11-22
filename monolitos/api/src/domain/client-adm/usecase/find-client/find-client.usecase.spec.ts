import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "name",
  email: "email",
  document: "123456789",
  street: "street",
  number: "1",
  complement: "complement",
  city: "city",
  state: "state",
  zipCode: "12345678",
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
    expect(client.document).toBe("123456789");
    expect(client.street).toBe("street");
    expect(client.number).toBe("1");
    expect(client.complement).toBe("complement");
    expect(client.city).toBe("city");
    expect(client.state).toBe("state");
    expect(client.zipCode).toBe("12345678");
  });
});
