import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export type InvoiceFacadeProps = {
  findUseCase: FindInvoiceUseCase;
  generateUseCase: GenerateInvoiceUseCase;

}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  findUseCase: FindInvoiceUseCase;
  generateUseCase: GenerateInvoiceUseCase;

  constructor(private props: InvoiceFacadeProps) {
    this.findUseCase = props.findUseCase;
    this.generateUseCase = props.generateUseCase;
  }

  async generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return this.generateUseCase.execute(input);
  }

  async find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
    return this.findUseCase.execute(input);
  }
}