import { Injectable, Logger } from '@nestjs/common'
import { ServiceRepositoryPort } from '../../domain/repositories/service.repository.port'
import { UpdateServiceInput } from '../../domain/interfaces/update-service.input.interface'
import { ServiceDomain } from '../../domain/entities/service.entity'
import { CustomException } from '@/common/exceptions/customException'

@Injectable()
export class UpdateServiceUseCase {
  private readonly logger = new Logger(UpdateServiceUseCase.name)

  constructor(private readonly repo: ServiceRepositoryPort) {}

  async execute(id: number, input: UpdateServiceInput): Promise<ServiceDomain> {
    this.logger.log('Atualizando serviço', { id, ...input })
    if (input.name) {
      const exists = await this.repo.exists(input.name, id)
      if (exists.exists) {
        throw new CustomException('nome já está sendo usado')
      }
    }
    const service = await this.repo.update(id, input)
    this.logger.log('Serviço atualizado com sucesso')
    return service
  }
}
