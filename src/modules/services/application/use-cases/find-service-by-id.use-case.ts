import { Injectable } from '@nestjs/common'
import { ServiceRepositoryPort } from '../../domain/repositories/service.repository.port'
import { ServiceDomain } from '../../domain/entities/service.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { convertToMoney } from '@/common/utils/convert-to-money'

@Injectable()
export class FindServiceByIdUseCase {
  constructor(private readonly repo: ServiceRepositoryPort) {}

  async execute(id: number): Promise<ServiceDomain> {
    const service = await this.repo.findOne(id)
    if (!service) {
      throw new CustomException(ErrorMessages.SERVICE.NOT_FOUND)
    }
    return service
  }
}
