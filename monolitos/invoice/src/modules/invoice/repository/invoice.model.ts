import {
  Table,
  Model,
  PrimaryKey,
  Column,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import InvoiceItemsModel from "./invoice-item.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export default class InvoiceModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare document: string;

  @Column({ allowNull: false })
  declare street: string;

  @Column({ allowNull: false })
  declare number: string;

  @Column({ allowNull: false })
  declare complement: string;
  
  @Column({ allowNull: false })
  declare city: string;

  @Column({ allowNull: false })
  declare state: string;

  @Column({ allowNull: false })
  declare zip_code: string;

  @HasMany(() => InvoiceItemsModel)
  declare items: ReturnType<() => InvoiceItemsModel[]>;

  @Column({ allowNull: false })
  declare total: number;
}