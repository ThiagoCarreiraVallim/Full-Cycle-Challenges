import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductsUsecase from "./find-all-products.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  salesPrice: 10,
});

const product2 = new Product({
  id: new Id("2"),
  name: "Product 2",
  description: "Product 2 description",
  salesPrice: 20,
});

const MockRepository = () => {
  return {
    findAll: jest.fn().mockResolvedValue([product, product2]),
    find: jest.fn(),
  };
}

describe("Find all products usecase unit test", () => {
  it("should return all products", async () => {
    const expectResults = {
      products: [
        {
          id: product.id,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        },
        {
          id: product2.id,
          name: product2.name,
          description: product2.description,
          salesPrice: product2.salesPrice,
        },
      ],
    };
    
    const repository = MockRepository();
    const usecase = new FindAllProductsUsecase(repository);
    const result = await usecase.execute();

    expect(repository.findAll).toBeCalledTimes(1);
    expect(result).toStrictEqual(expectResults);
  });
});