import express, { Request, Response } from 'express';
import ListProductUseCase from '../../../usecase/product/list/list.product.usecase';
import ProductRepository from '../../product/repository/sequelize/product.repository';
import CreateProductUseCase from '../../../usecase/product/create/create.product.usecase';

export const productRouter = express.Router();

productRouter.post('/', async (req: Request, res: Response) => {
  const usecase = new CreateProductUseCase(new ProductRepository());
  try {
    const productDto = {
      name: req.body.name,
      price: req.body.price,
    }
    const output = await usecase.execute(productDto);
    res.status(201).send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});

productRouter.get('/', async (req: Request, res: Response) => {
  const usecase = new ListProductUseCase(new ProductRepository());
  try {
    const output = await usecase.execute();
    res.status(200).send(output);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
