import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Customer } from '../entities/customer.entity'
import { CreateCustomerDto } from '../dto/create-customer.dto'
import { UpdateCustomerDto } from '../dto/update-customer.dto'
import { CustomerRepositoryPort } from './port/customer.repository.port'

@Injectable()
export class CustomerRepository extends CustomerRepositoryPort {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {
    super()
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.repository.create(createCustomerDto)
    return await this.repository.save(customer)
  }

  async findAll(): Promise<Customer[]> {
    return await this.repository.find()
  }

  async findOne(id: number): Promise<Customer | null> {
    return await this.repository.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return await this.repository.findOne({ where: { email } })
  }

  async findByDocument(documentNumber: string): Promise<Customer | null> {
    return await this.repository.findOne({
      where: { documentNumber: documentNumber },
    })
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    await this.repository.update(id, updateCustomerDto)
    const updatedCustomer = await this.findOne(id)
    if (!updatedCustomer) {
      throw new Error(`Customer with ID ${id} not found`)
    }
    return updatedCustomer
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id)
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`)
    }
    await this.repository.remove(customer)
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { id } })
    return count > 0
  }
}
