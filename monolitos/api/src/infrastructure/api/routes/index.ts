import { Router } from 'express';
import productRoute from './product.routes';
import clientRoute from './clients.routes';
import checkoutRoute from './checkout.routes';

const routes = Router();

routes.use(productRoute);
routes.use(clientRoute);
routes.use(checkoutRoute);

export default routes;
