import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice";
import InvoiceItems from "../domain/entity/invoice-items.entity";
import Address from "../domain/value-objects/address.value-object";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemsModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async add(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zip_code: invoice.address.zipCode,
        total: invoice.invoiceTotal(),
        items: invoice.items.map((item) => {
          return {
            id: item.id.id,
            name: item.name,
            price: item.price,
          };
        }),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      {
        include: [{ model: InvoiceItemsModel }],
      }
    );
  }

  async find(id: string): Promise<Invoice> {
    const result = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemsModel],
    });

    if(!result) {
      throw new Error("Invoice not found");
    }

    return new Invoice({
      id: new Id(result.id),
      name: result.name,
      document: result.document,
      address: new Address({
        street: result.street,
        number: result.number,
        complement: result.complement,
        city: result.city,
        state: result.state,
        zipCode: result.zip_code,
      }),
      items: result.items.map((item) => {
        return new InvoiceItems({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }
}