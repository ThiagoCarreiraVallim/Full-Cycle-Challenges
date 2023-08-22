import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface{
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity
      }))
    },
    {
      include: [{ model: OrderItemModel }]
    });
  }

  async update(entity: Order): Promise<void> {
    const orderItens = entity.items.map((item) => OrderItemModel.update(
      {
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
      },
      {
        where: { id: item.id }
      }
    ));
    
    await Promise.all(orderItens);

    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total()
      },
      {
        where: { id: entity.id },
      }
    )
  }

  async find(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
      where: {
        id,
      },
      include: ["items"]
    });

    if (!order) {
      throw new Error("Order not found!");
    }

    return new Order(
      order.id,
      order.customer_id,
      order.items.map((item) => new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity,
      ))
    )
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({ include: ["items"] });
    return orders.map((order) => new Order(
      order.id, 
      order.customer_id,
      order.items.map((item) => new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity,
      ))
    ));
  }
}