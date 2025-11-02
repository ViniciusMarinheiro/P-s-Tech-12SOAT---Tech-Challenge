import { Injectable } from '@nestjs/common'
import { CustomerRepositoryPort } from '../../domain/repositories/customer.repository.port'
import { CreateCustomerInput } from '../../domain/interfaces/create-customer.input.interface'
import { CustomerDomain } from '../../domain/entities/customer.entity'
import { CustomException } from '@/common/exceptions/customException'

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly repo: CustomerRepositoryPort) {}

  async execute(input: CreateCustomerInput): Promise<CustomerDomain> {
    const exists = await this.repo.exists(
      input.documentNumber,
      input.email,
      input.phone,
    )
    if (exists.exists) {
      const fieldName =
        exists.field === 'documentNumber'
          ? 'CPF/CNPJ'
          : exists.field === 'email'
            ? 'email'
            : 'telefone'
      throw new CustomException(`${fieldName} já está sendo usado`)
    }
    return this.repo.create(input)
  }
}
