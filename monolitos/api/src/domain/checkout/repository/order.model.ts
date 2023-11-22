import { Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderItemsModel from "./order-item.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrdersModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare email: string;

  @Column({ allowNull: false })
  declare address: string;

  @HasMany(() => OrderItemsModel)
  declare items: ReturnType<() => OrderItemsModel[]>;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}