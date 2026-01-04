import { Injectable, Logger } from '@nestjs/common'
import { PartRepositoryPort } from '../../domain/repositories/part.repository.port'
import { PartDomain } from '../../domain/entities/part.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { convertToMoney } from '@/common/utils/convert-to-money'

@Injectable()
export class FindPartByIdUseCase {
  private readonly logger = new Logger(FindPartByIdUseCase.name)

  constructor(private readonly repo: PartRepositoryPort) {}

  async execute(id: number): Promise<PartDomain> {
    this.logger.log('Buscando peça por ID', { id })
    const part = await this.repo.findOne(id)
    if (!part) {
      throw new CustomException(ErrorMessages.PART.NOT_FOUND)
    }
    return part
  }
}
