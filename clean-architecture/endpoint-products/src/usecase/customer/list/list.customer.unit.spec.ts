import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUseCase, { OutputMapper } from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Street", 123, "Zip", "City"),
);

const customer2 = CustomerFactory.createWithAddress(
  "John Doe",
  new Address("Street", 123, "Zip", "City"),
);

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
    create: jest.fn(),
    update: jest.fn(),
  };
}

const expectedOutput = OutputMapper.toOutput([customer1, customer2])

describe("Unit test for customer list use case", () => {
  it("Should list a customers", async () => {
    const customerRepository = MockRepository();
    const customerListUseCase = new ListCustomerUseCase(customerRepository);

    const output = await customerListUseCase.execute();

    expect(output.customers).toStrictEqual(expectedOutput.customers);
    expect(output.customers.length).toBe(2); 
  });
});