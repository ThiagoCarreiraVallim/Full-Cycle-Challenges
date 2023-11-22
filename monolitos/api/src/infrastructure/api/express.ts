import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../../domain/client-adm/repository/client.model';
import InvoiceModel from '../../domain/invoice/repository/invoice.model';
import TransactionModel from '../../domain/payment/repository/transaction.model';
import ProductAdmModel from '../../domain/product-adm/repository/product.model';
import ProductModel from '../../domain/store-catalog/repository/product.model';
import InvoiceItemsModel from '../../domain/invoice/repository/invoice-item.model';
import routes from './routes';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use(routes);

const setupDb = async () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    sync: { force: true },
  });
  sequelize.addModels([
    ClientModel,
    InvoiceModel,
    InvoiceItemsModel,
    TransactionModel,
    ProductAdmModel,
    ProductModel,
  ]);
  await sequelize.sync({ force: true });
}
setupDb();

export default app;