import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice";
import InvoiceItems from "../../domain/entity/invoice-items.entity";
import Address from "../../domain/value-objects/address.value-object";
import FindInvoiceUseCase from "./find-invoice.usecase";

const mockRepositoryInvoice = new Invoice({
  name: "Client 1",
  document: "000.000.000-00",
  address: new Address({
    street: "Street 1",
    number: "1",
    complement: "Complement 1",
    city: "City 1",
    state: "State 1",
    zipCode: "00000-000",
  }),
  items: [
    {
      id: new Id("1"),
      name: "Product 1",
      price: 100,
    },
    {
      id: new Id("2"),
      name: "Product 2",
      price: 200,
    },
  ].map(item => new InvoiceItems(item)),
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockResolvedValue(mockRepositoryInvoice),
  };
}

describe("Find invoice use case test", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    }

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(mockRepositoryInvoice.name);
    expect(result.document).toBe(mockRepositoryInvoice.document);
    expect(result.address.street).toBe(mockRepositoryInvoice.address.street);
    expect(result.address.number).toBe(mockRepositoryInvoice.address.number);
    expect(result.address.complement).toBe(mockRepositoryInvoice.address.complement);
    expect(result.address.city).toBe(mockRepositoryInvoice.address.city);
    expect(result.address.state).toBe(mockRepositoryInvoice.address.state);
    expect(result.address.zipCode).toBe(mockRepositoryInvoice.address.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Product 1");
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("Product 2");
    expect(result.items[1].price).toBe(200);
    expect(result.total).toBe(300);
    expect(result.createdAt).toBeDefined();
  });
});