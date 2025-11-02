import { Injectable } from '@nestjs/common'
import { PartRepositoryPort } from '../../domain/repositories/part.repository.port'
import { CreatePartInput } from '../../domain/interfaces/create-part.input.interface'
import { PartDomain } from '../../domain/entities/part.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class CreatePartUseCase {
  constructor(private readonly repo: PartRepositoryPort) {}

  async execute(input: CreatePartInput): Promise<PartDomain> {
    const exists = await this.repo.exists(input.name)
    if (exists.exists) {
      throw new CustomException(ErrorMessages.PART.ALREADY_EXISTS(input.name))
    }
    return await this.repo.create(input)
  }
}
