import { Injectable, NotFoundException } from '@nestjs/common'
import { Customer } from './entities/customer.entity'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerRepositoryPort } from './repositories/port/customer.repository.port'

@Injectable()
export class CustomersService {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customerRepository.create(createCustomerDto)
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.findAll()
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne(id)
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`)
    }
    return customer
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.customerRepository.update(id, updateCustomerDto)
  }

  async remove(id: number): Promise<void> {
    await this.customerRepository.remove(id)
  }
}
