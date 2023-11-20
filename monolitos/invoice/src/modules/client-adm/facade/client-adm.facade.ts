import ClientGateway from "../gateway/client.geteway";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeInterface, { AddClientFacadeInputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";

export type ClientAdmProps = {
  addUseCase: AddClientUseCase;
  findUseCase: FindClientUseCase;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  addUseCase: AddClientUseCase;
  findUseCase: FindClientUseCase;

  constructor(props: ClientAdmProps) {
    this.addUseCase = props.addUseCase;
    this.findUseCase = props.findUseCase;
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this.addUseCase.execute(input);
  }

  async find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
    const client = await this.findUseCase.execute(input);
    return client;
  }
}