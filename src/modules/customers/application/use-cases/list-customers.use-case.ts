import { Injectable } from '@nestjs/common'
import { CustomerRepositoryPort } from '../../domain/repositories/customer.repository.port'
import { CustomerDomain } from '../../domain/entities/customer.entity'

@Injectable()
export class ListCustomersUseCase {
  constructor(private readonly repo: CustomerRepositoryPort) {}

  async execute(): Promise<CustomerDomain[]> {
    return this.repo.findAll()
  }
}
