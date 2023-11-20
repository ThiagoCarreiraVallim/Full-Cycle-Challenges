import ClientGateway from "../../gateway/client.geteway";
import { FindClientInputDto } from "./find-client.usecase.dto";

export default class FindClientUseCase {
  constructor(private readonly clientRepository: ClientGateway) {}

  async execute(input: FindClientInputDto) {
    const client = await this.clientRepository.find(input.id);
    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}