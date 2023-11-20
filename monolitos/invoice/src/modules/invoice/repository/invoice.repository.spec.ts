import { Sequelize } from "sequelize-typescript";
import Invoice from "../domain/entity/invoice";
import Address from "../domain/value-objects/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/entity/invoice-items.entity";
import InvoiceRepository from "./invoice.repository";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoice-item.model";

describe("InvoiceReposotory test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const input = new Invoice({
      name: "Client 1",
      document: "000.000.000-00",
      address: new Address({
        street: "Street 1",
        number: "1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "00000-000",
      }),
      items: [
        {
          id: new Id("1"),
          name: "Product 1",
          price: 100,
        },
        {
          id: new Id("2"),
          name: "Product 2",
          price: 200,
        },
      ].map(item => new InvoiceItems(item)),
    });

    const invoiceRepository = new InvoiceRepository();
    await invoiceRepository.add(input);

    const invoice = await InvoiceModel.findOne({
      where: { id: input.id.id },
      include: [InvoiceItemsModel],
    });    

    expect(invoice).toBeDefined();
    expect(invoice?.id).toBe(input.id.id);
    expect(invoice?.name).toBe(input.name);
    expect(invoice?.document).toBe(input.document);
    expect(invoice?.street).toBe(input.address.street);
    expect(invoice?.number).toBe(input.address.number);
    expect(invoice?.complement).toBe(input.address.complement);
    expect(invoice?.city).toBe(input.address.city);
    expect(invoice?.state).toBe(input.address.state);
    expect(invoice?.zip_code).toBe(input.address.zipCode);
    expect(invoice?.total).toBe(input.invoiceTotal());
    expect(invoice?.items).toHaveLength(2);
    expect(invoice?.items[0].id).toBe("1");
    expect(invoice?.items[0].name).toBe("Product 1");
    expect(invoice?.items[0].price).toBe(100);
    expect(invoice?.items[1].id).toBe("2");
    expect(invoice?.items[1].name).toBe("Product 2");
    expect(invoice?.items[1].price).toBe(200);
  });

  it("should find an invoice", async () => {
    await InvoiceModel.create({
      id: "1",
      name: "Client 1",
      document: "000.000.000-00",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zip_code: "00000-000",
      total: 300,
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 100,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      include: [{ model: InvoiceItemsModel }],
    });

    const invoiceRepository = new InvoiceRepository();
    const invoice = await invoiceRepository.find("1");

    expect(invoice).toBeDefined();
    expect(invoice.id.id).toBe("1");
    expect(invoice.name).toBe("Client 1");
    expect(invoice.document).toBe("000.000.000-00");
    expect(invoice.address.street).toBe("Street 1");
    expect(invoice.address.number).toBe("1");
    expect(invoice.address.complement).toBe("Complement 1");
    expect(invoice.address.city).toBe("City 1");
    expect(invoice.address.state).toBe("State 1");
    expect(invoice.address.zipCode).toBe("00000-000");
    expect(invoice.invoiceTotal()).toBe(300);
    expect(invoice.createdAt).toBeDefined();
    expect(invoice.items).toHaveLength(2);
    expect(invoice.items[0].id.id).toBe("1");
    expect(invoice.items[0].name).toBe("Product 1");
    expect(invoice.items[0].price).toBe(100);
    expect(invoice.items[1].id.id).toBe("2");
    expect(invoice.items[1].name).toBe("Product 2");
    expect(invoice.items[1].price).toBe(200);
  });
});
