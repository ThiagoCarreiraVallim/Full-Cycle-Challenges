import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "../../../order/repository/sequelize/order.model";
import OrderRepository from "./order.repository";


const makeSut = async () => {
  const customerRepository = new CustomerRepository();
  const customer = new Customer("123", "Customer 1");
  const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
  customer.changeAddress(address);
  await customerRepository.create(customer);

  const productRepository = new ProductRepository();
  const product = new Product("123", "Product 1", 10);
  await productRepository.create(product);

  const orderItem = new OrderItem(
    "1",
    product.name,
    product.price,
    product.id,
    2
  );

  const order = new Order("123", "123", [orderItem]);

  const orderRepository = new OrderRepository();
  await orderRepository.create(order);

  return {
    customer,
    address,
    product,
    orderItem,
    order,
    orderRepository,
  }
}

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const { order, orderItem } = await makeSut();

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel?.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should list all orders", async () => {
    const { orderItem, orderRepository } = await makeSut();

    const result = await orderRepository.findAll()
    
    expect(result).toStrictEqual([new Order(
      "123",
      "123",
      [ new OrderItem(
        orderItem.id,
        orderItem.name,
        orderItem.price,
        "123",
        orderItem.quantity,
      )
      ],
    )]);
  });

  it("should list a order", async () => {
    const { order, orderItem, orderRepository } = await makeSut();

    const result = await orderRepository.find(order.id);
    
    expect(result).toStrictEqual(new Order(
      "123",
      "123",
      [ new OrderItem(
        orderItem.id,
        orderItem.name,
        orderItem.price,
        "123",
        orderItem.quantity,
      )
      ],
    ));
  });

  it("should throw a error if order not exists", async () => {
    const { orderRepository } = await makeSut();

    try {
      await orderRepository.find("9999999");
    } catch (error) {
      expect(error).toStrictEqual(new Error("Order not found!"))
    }
  });
  
  it("should update a order", async () => {
    const { order, orderItem, orderRepository } = await makeSut();

    order.items[0].quantity = 4;

    try {
      await orderRepository.update(order);
    } catch (error) {
      console.log(error);
    }

    const result = await orderRepository.find(order.id);
    
    expect(result).toStrictEqual(new Order(
      "123",
      "123",
      [ new OrderItem(
        orderItem.id,
        orderItem.name,
        orderItem.price,
        "123",
        4
      )
      ],
    ));
  });

});