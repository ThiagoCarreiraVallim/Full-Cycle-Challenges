import Customer from "../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import { OutputListCustomerDto } from "./list.customer.dto";

export default class ListCustomerUseCase {
  private customerRepository: CustomerRepositoryInterface;
  constructor (customerRepository: CustomerRepositoryInterface) {
    this.customerRepository = customerRepository;
  }

  async execute() {
    const customers = await this.customerRepository.findAll();
    return OutputMapper.toOutput(customers);
  }
}

export class OutputMapper {
  static toOutput(customer: Customer[]): OutputListCustomerDto {
    return {
      customers: customer.map((customer) => {
        return {
          id: customer.id,
          name: customer.name,
          address: {
            street: customer.Address.street,
            number: customer.Address.number,
            zip: customer.Address.zip,
            city: customer.Address.city,
          },
        };
      }),
    };
  }
}