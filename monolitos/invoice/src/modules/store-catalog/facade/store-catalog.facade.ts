import { FindAllProductsOutputDto } from "../use-case/find-all-products/find-all-products.dto";
import FindAllProductsUsecase from "../use-case/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../use-case/find-product/find-procut.usecase";
import StoreCatalogFacadeInterface, { FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findUseCase: FindProductUseCase;
  findAllUseCase: FindAllProductsUsecase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findUseCase: FindProductUseCase;
  private _findAllUseCase: FindAllProductsUsecase;

  constructor(private props: UseCaseProps) {
    this._findUseCase = props.findUseCase;
    this._findAllUseCase = props.findAllUseCase;
  }

  async find(id: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
    const product = await this._findUseCase.execute(id);
    return product;
  }

  async findAll(): Promise<FindAllProductsOutputDto> {
    const products = await this._findAllUseCase.execute();
    return products;
  }
}