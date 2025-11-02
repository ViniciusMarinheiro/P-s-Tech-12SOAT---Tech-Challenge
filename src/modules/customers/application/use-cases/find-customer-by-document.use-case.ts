import { Injectable, HttpStatus } from '@nestjs/common'
import { CustomerRepositoryPort } from '../../domain/repositories/customer.repository.port'
import { CustomerDomain } from '../../domain/entities/customer.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class FindCustomerByDocumentUseCase {
  constructor(private readonly repo: CustomerRepositoryPort) {}

  async execute(document: string): Promise<CustomerDomain> {
    const customer = await this.repo.findOneByDocument(document)
    if (!customer) {
      throw new CustomException(
        ErrorMessages.CUSTOMER.NOT_FOUND_DOCUMENT(document),
        HttpStatus.NO_CONTENT,
      )
    }
    return customer
  }
}
