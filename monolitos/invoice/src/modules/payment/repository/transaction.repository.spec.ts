import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import Transaction from "../domain/transaction";
import Id from "../../@shared/domain/value-object/id.value-object";
import TransactionRepository from "./transaction.repository";

describe("ProductRepository test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([TransactionModel]);
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a transaction", async () => {
    const transaction = new Transaction({
      id: new Id("1"),
      amount: 100,
      orderId: "1",
    });

    const repository = new TransactionRepository();
    const result = await repository.save(transaction);

    expect(result.id.id).toBe(transaction.id.id);
    expect(result.amount).toBe(transaction.amount);
    expect(result.orderId).toBe(transaction.orderId);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(result.status).toBe("pending");
  });
});