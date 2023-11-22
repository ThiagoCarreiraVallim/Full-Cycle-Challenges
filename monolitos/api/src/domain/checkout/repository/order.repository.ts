import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderItemsModel from "./order-item.model";
import { OrdersModel } from "./order.model";

export default class OrderRepository implements CheckoutGateway {
  constructor() {}

  async addOrder(order: Order): Promise<void> {
    await OrdersModel.create(
      {
        id: order.id.id,
        name: order.client.name,
        email: order.client.email,
        address: order.client.address,
        items: order.products.map((product) => ({
          id: product.id.id,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })),
      },
      {
        include: [{ model: OrderItemsModel }],
      }
    );
  }

  async findOrder(id: string): Promise<Order | null> {
    return null;
  }
}