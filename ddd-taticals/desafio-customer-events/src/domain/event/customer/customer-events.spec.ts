import EventDispatcher from "../@shared/event-dispatcher";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1-customer-created.handle";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2-customer-created.handle";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLogHandler from "./handler/envia-console-log-change-address.handle";
import CustomerChangeAddressEvent from "./customer-change-address.event";
import Customer from "../../entity/customer";
import Address from "../../entity/address";

describe("Customer events tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log all event handlers when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerLog1 = new EnviaConsoleLog1Handler();
    const eventHandlerLog2 = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog2);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: "123",
      name: "Customer 1",
    });

    jest.spyOn(console, "log");
    jest.spyOn(console, "log");

    eventDispatcher.notify(customerCreatedEvent);

    expect(console.log).toHaveBeenNthCalledWith(1, "Esse é o primeiro console.log do evento: CustomerCreated");
    expect(console.log).toHaveBeenNthCalledWith(2, "Esse é o segundo console.log do evento: CustomerCreated");
  });

  it("should log a event handler when customer change address", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerLog = new EnviaConsoleLogHandler();

    eventDispatcher.register("CustomerChangeAddressEvent", eventHandlerLog);

    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Rua 1", 123, "12345678", "São Paulo"));
      
    const customerChangeAddressEvent = new CustomerChangeAddressEvent(customer);

    jest.spyOn(console, "log");

    eventDispatcher.notify(customerChangeAddressEvent);

    expect(console.log).toHaveBeenCalledWith("Endereço do cliente: 123, Customer 1 alterado para Rua 1, 123, 12345678 São Paulo");
  });
});