import { Injectable, Logger } from '@nestjs/common'
import { CustomerRepositoryPort } from '../../domain/repositories/customer.repository.port'
import { CustomerDomain } from '../../domain/entities/customer.entity'

@Injectable()
export class ListCustomersUseCase {
  private readonly logger = new Logger(ListCustomersUseCase.name)

  constructor(private readonly repo: CustomerRepositoryPort) {}

  async execute(): Promise<CustomerDomain[]> {
    this.logger.log('Listando clientes')
    const customers = await this.repo.findAll()
    this.logger.log('Clientes listados com sucesso', {
      count: customers.length,
    })
    return customers
  }
}
