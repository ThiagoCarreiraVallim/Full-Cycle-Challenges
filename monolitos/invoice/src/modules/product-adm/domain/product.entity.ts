import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity"
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
  id?: Id;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default class Product extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _description: string;
  private _purchasePrice: number;
  private _stock: number;

  constructor(props: ProductProps) {
    super(props.id);
    this._name = props.name;
    this._description = props.description;
    this._purchasePrice = props.purchasePrice;
    this._stock = props.stock;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
    this.updatedAt = new Date();
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
    this.updatedAt = new Date();
  }

  get purchasePrice(): number {
    return this._purchasePrice;
  }

  set purchasePrice(purchasePrice: number) {
    this._purchasePrice = purchasePrice;
    this.updatedAt = new Date();
  }

  get stock(): number {
    return this._stock;
  }

  set stock(stock: number) {
    this._stock = stock;
    this.updatedAt = new Date();
  }
}