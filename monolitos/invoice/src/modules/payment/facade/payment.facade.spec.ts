import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import PaymentFacadeFactory from "../factory/payment.facade.factory";

describe("PaymentFacade test", () => {

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
    const transaction = {
      amount: 100,
      orderId: "1",
    };

    const facade = PaymentFacadeFactory.create();
    const result = await facade.process(transaction);

    expect(result.transactionId).toBeDefined();
    expect(result.amount).toBe(transaction.amount);
    expect(result.orderId).toBe(transaction.orderId);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
    expect(result.status).toBe("approved");
  });
});