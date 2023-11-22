import { Router } from "express";
import ProductAdmFacadeFactory from "../../../domain/product-adm/factory/facade.factory";

const route = Router();

route.post('/product', async (req, res) => {
  const productInput = {
    name: req.body.name,
    description: req.body.description,
    purchasePrice: req.body.purchasePrice,
    stock: req.body.stock,
  };

  const product = await ProductAdmFacadeFactory.create().addProduct(productInput);

  res.status(201).send(product);
});

export default route;