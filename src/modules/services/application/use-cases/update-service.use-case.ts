import { Injectable } from '@nestjs/common'
import { ServiceRepositoryPort } from '../../domain/repositories/service.repository.port'
import { UpdateServiceInput } from '../../domain/interfaces/update-service.input.interface'
import { ServiceDomain } from '../../domain/entities/service.entity'
import { CustomException } from '@/common/exceptions/customException'

@Injectable()
export class UpdateServiceUseCase {
  constructor(private readonly repo: ServiceRepositoryPort) {}

  async execute(id: number, input: UpdateServiceInput): Promise<ServiceDomain> {
    if (input.name) {
      const exists = await this.repo.exists(input.name, id)
      if (exists.exists) {
        throw new CustomException('nome já está sendo usado')
      }
    }
    return this.repo.update(id, input)
  }
}
