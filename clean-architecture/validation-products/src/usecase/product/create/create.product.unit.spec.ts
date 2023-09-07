import ProductFactory from "../../../domain/product/factory/product.factory";
import CreateProductUseCase from "./create.product.usecase";

const input = {
  name: 'Product 1',
  price: 10,
}

const product = ProductFactory.create("Product 1", 10);

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
}

const expectResult = {
  id: product.id,
  name: product.name,
  price: product.price,
}

describe("Unit test for product create use case", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should create a product", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);
    const factory = jest.spyOn(ProductFactory, 'create').mockReturnValue(product);

    const output = await useCase.execute(input);

    expect(factory).toBeCalledWith(input.name, input.price);
    expect(productRepository.create).toBeCalledWith(product);
    expect(output).toEqual(expectResult);
  });
});


