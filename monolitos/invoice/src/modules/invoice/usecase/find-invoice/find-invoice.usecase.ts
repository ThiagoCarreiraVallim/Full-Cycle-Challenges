import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.usecase.dto";

export default class FindInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceGateway) {}

  async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this.invoiceRepository.find(input.id);
    return {
      ...invoice.toJson(),
      total: invoice.invoiceTotal(),
      createdAt: invoice.createdAt,
    }
  }
}