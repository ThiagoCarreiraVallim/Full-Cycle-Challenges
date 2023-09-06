import express, { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import CustomerModel from '../customer/repository/sequelize/customer.model';
import { customerRoute } from './routes/customer.route';
import { productRouter } from './routes/product.router';
import ProductModel from '../product/repository/sequelize/product.model';

export const app: Express = express();

app.use(express.json());

app.use('/customer', customerRoute);
app.use('/product', productRouter);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
  sequelize.addModels([CustomerModel, ProductModel]);
  await sequelize.sync();
}
setupDb();
