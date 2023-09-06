import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";

const product1 = ProductFactory.create("Product 1", 10);
const product2 = ProductFactory.create("Product 2", 20);

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    create: jest.fn(),
    update: jest.fn(),
  };
}

describe("Unit test for product list use case", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("Should list all products", async () => {
    const productRepository = MockRepository();
    const useCase = new ListProductUseCase(productRepository);

    const expectedResult = useCase.toOutput([product1, product2]);

    const output = await useCase.execute();
    
    expect(productRepository.findAll).toBeCalled();
    expect(output).toHaveProperty("products");
    expect(output).toStrictEqual(expectedResult);
  });
});