import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

const product = ProductFactory.create("Product 1", 10);

const input = {
  id: product.id,
  name: "Product 1 Updated",
  price: 20,
};

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
}

describe("Unit test for product update use case", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should update a product", async () => {
    const productRepository = MockRepository();
    const useCase = new UpdateProductUseCase(productRepository);
    const find = jest.spyOn(productRepository, "find");

    const output = await useCase.execute(input);

    expect(find).toBeCalledWith(input.id);
    expect(output).toEqual(input);
  }); 

  it("Should throw an error when product is not found", async () => {
    const productRepository = MockRepository();
    const useCase = new UpdateProductUseCase(productRepository);
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });


    expect(() => {
      return useCase.execute(input)
    }).rejects.toThrow("Product not found");
  });
});