import { Router } from "express";
import CheckoutFacadeFactory from "../../../domain/checkout/factory/facade.checkout.factory";
import { PlaceOrderFacadeInputDto } from "../../../domain/checkout/facade/checkout.facade.dto";

const route = Router();

route.post('/checkout', async (req, res) => {
  const checkoutInput: PlaceOrderFacadeInputDto = {
    clientId: req.body.clientId,
    products: req.body.products,
  };

  const checkout = await CheckoutFacadeFactory.create().placeOrder(checkoutInput);

  res.status(201).send(checkout);
});

export default route;