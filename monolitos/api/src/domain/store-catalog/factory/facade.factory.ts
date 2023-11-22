import StoreCatalogFacade from "../facade/store-catalog.facade";
import ProductRepository from "../repository/product.repository";
import FindAllProductsUsecase from "../use-case/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../use-case/find-product/find-procut.usecase";

export default class StoreCatalogFacadeFactory {
  static create(): StoreCatalogFacade {
    const productRepository = new ProductRepository();
    const findUseCase = new FindProductUseCase(productRepository);
    const findAllUseCase = new FindAllProductsUsecase(productRepository);

    const facade = new StoreCatalogFacade({
      findUseCase,
      findAllUseCase,
    });

    return facade;
  }
}