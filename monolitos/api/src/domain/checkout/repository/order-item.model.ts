import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrdersModel } from "./order.model";

@Table({
  tableName: "order_items",
  timestamps: false,
})
export default class OrderItemsModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare description: string;

  @Column({ allowNull: false })
  declare salesPrice: number;

  @ForeignKey(() => OrdersModel)
  @Column({ allowNull: false })
  declare order_id: string;

  @BelongsTo(() => OrdersModel)
  declare order: ReturnType<() => OrdersModel>;
}