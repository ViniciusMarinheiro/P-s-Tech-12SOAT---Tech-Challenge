import { Injectable } from '@nestjs/common'
import { ServiceRepositoryPort } from '../../domain/repositories/service.repository.port'
import { CreateServiceInput } from '../../domain/interfaces/create-service.input.interface'
import { ServiceDomain } from '../../domain/entities/service.entity'
import { CustomException } from '@/common/exceptions/customException'

@Injectable()
export class CreateServiceUseCase {
  constructor(private readonly repo: ServiceRepositoryPort) {}

  async execute(input: CreateServiceInput): Promise<ServiceDomain> {
    const exists = await this.repo.exists(input.name)
    if (exists.exists) {
      throw new CustomException('nome já está sendo usado')
    }
    return this.repo.create(input)
  }
}
