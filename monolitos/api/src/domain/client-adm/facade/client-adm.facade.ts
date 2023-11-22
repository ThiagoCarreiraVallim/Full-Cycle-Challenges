import ClientGateway from "../gateway/client.geteway";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeInterface, { AddClientFacadeInputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";

export type ClientAdmProps = {
  addUseCase: AddClientUseCase;
  findUseCase: FindClientUseCase;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _addUseCase: AddClientUseCase;
  private _findUseCase: FindClientUseCase;

  constructor(props: ClientAdmProps) {
    this._addUseCase = props.addUseCase;
    this._findUseCase = props.findUseCase;
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this._addUseCase.execute(input);
  }

  async find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
    const client = await this._findUseCase.execute(input);
    return client;
  }
}