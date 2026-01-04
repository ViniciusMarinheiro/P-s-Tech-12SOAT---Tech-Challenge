import { Injectable, Logger } from '@nestjs/common'
import { CustomerRepositoryPort } from '../../domain/repositories/customer.repository.port'
import { CustomerDomain } from '../../domain/entities/customer.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class FindCustomerByIdUseCase {
  private readonly logger = new Logger(FindCustomerByIdUseCase.name)

  constructor(private readonly repo: CustomerRepositoryPort) {}

  async execute(id: number): Promise<CustomerDomain> {
    this.logger.log('Buscando cliente por ID', { id })
    const customer = await this.repo.findOne(id)
    if (!customer) {
      throw new CustomException(ErrorMessages.CUSTOMER.NOT_FOUND(id))
    }
    return customer
  }
}
