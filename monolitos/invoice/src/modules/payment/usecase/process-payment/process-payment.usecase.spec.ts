import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
  id: new Id("1"),
  amount: 100,
  orderId: "1",
  status: "approved",
});

const MockRepository = () => {
  return {
    save: jest.fn().mockResolvedValue(transaction),
  };
}

const makeSut = (status: string, amount: number) => {
  const transaction = new Transaction({
    id: new Id("1"),
    amount,
    orderId: "1",
    status,
  });

  return {
    save: jest.fn().mockResolvedValue(transaction),
  };
}


describe("process payment usecase unit test", () => {
  it("should process a payment", async () => {
    const repository = makeSut("approved", 100);
    const usecase = new ProcessPaymentUseCase(repository);

    const input = {
      amount: 100,
      orderId: "1",
    }

    const transaction = await usecase.execute(input);

    expect(repository.save).toHaveBeenCalled();
    expect(transaction.transactionId).toBe("1");
    expect(transaction.amount).toBe(100);
    expect(transaction.orderId).toBe("1");
    expect(transaction.status).toBe("approved");
  });

  it("should decline a payment", async () => {
    const repository = makeSut("declined", 99);
    const usecase = new ProcessPaymentUseCase(repository);

    const input = {
      amount: 99,
      orderId: "1",
    }

    const transaction = await usecase.execute(input);

    expect(repository.save).toHaveBeenCalled();
    expect(transaction.transactionId).toBe("1");
    expect(transaction.amount).toBe(99);
    expect(transaction.orderId).toBe("1");
    expect(transaction.status).toBe("declined");
  });
});