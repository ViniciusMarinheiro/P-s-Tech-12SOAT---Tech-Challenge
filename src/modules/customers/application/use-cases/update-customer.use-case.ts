import { Injectable, Logger } from '@nestjs/common'
import { CustomerRepositoryPort } from '../../domain/repositories/customer.repository.port'
import { UpdateCustomerInput } from '../../domain/interfaces/update-customer.input.interface'
import { CustomerDomain } from '../../domain/entities/customer.entity'
import { CustomException } from '@/common/exceptions/customException'

@Injectable()
export class UpdateCustomerUseCase {
  private readonly logger = new Logger(UpdateCustomerUseCase.name)

  constructor(private readonly repo: CustomerRepositoryPort) {}

  async execute(
    id: number,
    input: UpdateCustomerInput,
  ): Promise<CustomerDomain> {
    this.logger.log('Atualizando cliente', { id, ...input })
    if (input.documentNumber || input.email || input.phone) {
      const exists = await this.repo.exists(
        input.documentNumber || '',
        input.email || '',
        input.phone,
        id,
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
    }
    const customer = await this.repo.update(id, input)
    this.logger.log('Cliente atualizado com sucesso')
    return customer
  }
}
