import { Injectable } from '@nestjs/common'
import { PartRepositoryPort } from '../../domain/repositories/part.repository.port'
import { UpdatePartInput } from '../../domain/interfaces/update-part.input.interface'
import { PartDomain } from '../../domain/entities/part.entity'

@Injectable()
export class UpdatePartStockUseCase {
  constructor(private readonly repo: PartRepositoryPort) {}

  async execute(id: number, input: UpdatePartInput): Promise<PartDomain> {
    return await this.repo.update(id, input)
  }
}
