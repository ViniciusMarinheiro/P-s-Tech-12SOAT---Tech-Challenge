import { Injectable, Logger } from '@nestjs/common'
import { PartRepositoryPort } from '../../domain/repositories/part.repository.port'
import { UpdatePartInput } from '../../domain/interfaces/update-part.input.interface'
import { PartDomain } from '../../domain/entities/part.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class UpdatePartUseCase {
  private readonly logger = new Logger(UpdatePartUseCase.name)

  constructor(private readonly repo: PartRepositoryPort) {}

  async execute(id: number, input: UpdatePartInput): Promise<PartDomain> {
    this.logger.log('Atualizando peça', { id, ...input })
    if (input.name) {
      const exists = await this.repo.exists(input.name, id)
      if (exists.exists) {
        throw new CustomException(ErrorMessages.PART.ALREADY_EXISTS(input.name))
      }
    }
    const part = await this.repo.update(id, input)
    this.logger.log('Peça atualizada com sucesso')
    return part
  }
}
