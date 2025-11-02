import { Injectable } from '@nestjs/common'
import { PartRepositoryPort } from '../../domain/repositories/part.repository.port'
import { PartDomain } from '../../domain/entities/part.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { convertToMoney } from '@/common/utils/convert-to-money'

@Injectable()
export class FindPartByIdUseCase {
  constructor(private readonly repo: PartRepositoryPort) {}

  async execute(id: number): Promise<PartDomain> {
    const part = await this.repo.findOne(id)
    if (!part) {
      throw new CustomException(ErrorMessages.PART.NOT_FOUND)
    }
    return part
  }
}
