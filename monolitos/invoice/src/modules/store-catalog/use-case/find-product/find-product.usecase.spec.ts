import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-procut.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  salesPrice: 100,
});

const MockRepository = () => {
  return {
    findAll: jest.fn(),
    find: jest.fn().mockResolvedValue(product),
  };
}

describe("find a product usecase unit test", () => {
  it("should find a product", async () => {
    const repository = MockRepository();
    const usecase = new FindProductUseCase(repository);

    const input = {
      id: "1",
    }

    const product = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(product.id).toBe("1");
    expect(product.name).toBe("Product 1");
    expect(product.description).toBe("Product 1 description");
    expect(product.salesPrice).toBe(100);
  });
});