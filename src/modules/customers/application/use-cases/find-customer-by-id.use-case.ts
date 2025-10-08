import { Injectable } from '@nestjs/common'
import { CustomerRepositoryPort } from '../../domain/repositories/customer.repository.port'
import { CustomerDomain } from '../../domain/entities/customer.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class FindCustomerByIdUseCase {
  constructor(private readonly repo: CustomerRepositoryPort) {}

  async execute(id: number): Promise<CustomerDomain> {
    const customer = await this.repo.findOne(id)
    if (!customer) {
      throw new CustomException(ErrorMessages.CUSTOMER.NOT_FOUND(id))
    }
    return customer
  }
}
