import { Injectable, Logger } from '@nestjs/common'
import { ServiceRepositoryPort } from '../../domain/repositories/service.repository.port'
import { CreateServiceInput } from '../../domain/interfaces/create-service.input.interface'
import { ServiceDomain } from '../../domain/entities/service.entity'
import { CustomException } from '@/common/exceptions/customException'

@Injectable()
export class CreateServiceUseCase {
  private readonly logger = new Logger(CreateServiceUseCase.name)

  constructor(private readonly repo: ServiceRepositoryPort) {}

  async execute(input: CreateServiceInput): Promise<ServiceDomain> {
    this.logger.log('Criando serviço', input)
    const exists = await this.repo.exists(input.name)
    if (exists.exists) {
      throw new CustomException('nome já está sendo usado')
    }
    const service = await this.repo.create(input)
    this.logger.log('Serviço criado com sucesso')
    return service
  }
}
