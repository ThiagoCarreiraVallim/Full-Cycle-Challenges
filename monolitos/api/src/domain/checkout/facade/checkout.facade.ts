import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import CheckoutFacadeInterface, { PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./checkout.facade.dto";

export default class CheckoutFacade implements CheckoutFacadeInterface {
  constructor(private readonly placeOrderUseCase: PlaceOrderUseCase) {}

  async placeOrder(order: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
    return this.placeOrderUseCase.execute(order);
  }
}