import Invoice from "../domain/entity/invoice";

export default interface InvoiceGateway {
  add(invoice: Invoice): Promise<void>;
  find(id: string): Promise<Invoice>;
}