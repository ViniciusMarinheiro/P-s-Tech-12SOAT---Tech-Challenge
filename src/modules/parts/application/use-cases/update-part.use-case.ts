import { Injectable } from '@nestjs/common'
import { PartRepositoryPort } from '../../domain/repositories/part.repository.port'
import { UpdatePartInput } from '../../domain/interfaces/update-part.input.interface'
import { PartDomain } from '../../domain/entities/part.entity'
import { CustomException } from '@/common/exceptions/customException'

@Injectable()
export class UpdatePartUseCase {
  constructor(private readonly repo: PartRepositoryPort) {}

  async execute(id: number, input: UpdatePartInput): Promise<PartDomain> {
    if (input.name) {
      const exists = await this.repo.exists(input.name, id)
      if (exists.exists) {
        throw new CustomException('nome já está sendo usado')
      }
    }
    return this.repo.update(id, input)
  }
}
