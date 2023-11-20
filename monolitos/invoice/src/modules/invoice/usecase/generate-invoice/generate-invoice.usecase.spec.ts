import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
}

const mockInputInvoice = {
  name: "Client 1",
  document: "000.000.000-00",
  street: "Street 1",
  number: "1",
  complement: "Complement 1",
  city: "City 1",
  state: "State 1",
  zipCode: "00000-000",
  items: [
    {
      id: "1",
      name: "Product 1",
      price: 100,
    },
    {
      id: "2",
      name: "Product 2",
      price: 200,
    },
  ],
};

describe("Generate invoice use case test", () => {
  it("should generate a invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

    const result = await usecase.execute(mockInputInvoice);

    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(mockInputInvoice.name);
    expect(result.document).toBe(mockInputInvoice.document);
    expect(result.street).toBe(mockInputInvoice.street);
    expect(result.number).toBe(mockInputInvoice.number);
    expect(result.complement).toBe(mockInputInvoice.complement);
    expect(result.city).toBe(mockInputInvoice.city);
    expect(result.state).toBe(mockInputInvoice.state);
    expect(result.zipCode).toBe(mockInputInvoice.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Product 1");
    expect(result.items[0].price).toBe(100);
    expect(result.items[1].id).toBe("2");
    expect(result.items[1].name).toBe("Product 2");
    expect(result.items[1].price).toBe(200);
  });
});