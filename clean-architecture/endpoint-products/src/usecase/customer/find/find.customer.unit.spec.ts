import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import FindCustomerUseCase from "./find.customer.usecase";

const customer = new Customer("123", "John");
const address = new Address("Street", 123, "zip", "city")
customer.changeAddress(address)

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe("Test find customer use case", () => {
  it("Should find a customer", async () => {
    const customerRepository = MockRepository();
    
    const useCase = new FindCustomerUseCase(customerRepository)

    const input = {
      id: "123",
    }

    const output = {
      id: "123",
      name: "John",
      address: {
        street: "Street",
        city: "city",
        number: 123,
        zip: "zip",
      }
    }

    const result = await useCase.execute(input);

    expect(result).toEqual(output);
  });

  it("Should not find a customer", async () => {
    const customerRepository = MockRepository();
    customerRepository.find.mockImplementation(() => {
      throw new Error("Customer not found");
    });

    const usecase = new FindCustomerUseCase(customerRepository);

    const input = {
      id: "123",
    };

    expect(() => {
      return usecase.execute(input)
    }).rejects.toThrow("Customer not found");
  });
});