import ProductFactory from "../../../domain/product/factory/product.factory";
import FindProductUseCase from "./find.product.usecase";

const input = {
  id: '123',
};

const product = ProductFactory.create("Product", 10);

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
}

const expectedResult = {
  id: product.id,
  name: product.name,
  price: product.price,
};

describe("Unit test for product find use case", () => {
  it("Should find a product", async () => {
    const productRepository = MockRepository();
    const productFindUseCase = new FindProductUseCase(productRepository);

    const output = await productFindUseCase.execute(input);

    expect(productRepository.find).toBeCalledWith(input.id);
    expect(output).toEqual(expectedResult);
  });

  it("Should not find a product", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });

    const productFindUseCase = new FindProductUseCase(productRepository);

    expect(() => {
      return productFindUseCase.execute(input)
    }).rejects.toThrow("Product not found");
  });
});