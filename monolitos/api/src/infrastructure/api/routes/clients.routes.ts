import { Router } from "express";
import ClientAdmFacadeFactory from "../../../domain/client-adm/factory/facade.factory";

const route = Router();

route.post('/clients', async (req, res) => {
  const clientInput = {
    name: req.body.name,
    document: req.body.document,
    email: req.body.email,
    street: req.body.street,
    number: req.body.number,
    complement: req.body.complement,
    city: req.body.city,
    state: req.body.state,
    zipCode: req.body.zipCode,
  };

  const client = await ClientAdmFacadeFactory.create().add(clientInput);

  res.status(201).send(client);
});

export default route;