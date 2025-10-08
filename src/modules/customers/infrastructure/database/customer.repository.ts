import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, Not, Repository } from 'typeorm'
import { Customer } from './customer.entity'
import { CreateCustomerInput } from '../../domain/interfaces/create-customer.input.interface'
import { UpdateCustomerInput } from '../../domain/interfaces/update-customer.input.interface'
import { CustomerRepositoryPort } from '../../domain/repositories/customer.repository.port'
import { CustomerDomain } from '../../domain/entities/customer.entity'
import { CustomerMapper } from '../mappers/customer.mapper'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class CustomerRepository extends CustomerRepositoryPort {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {
    super()
  }

  async create(
    createCustomerDto: CreateCustomerInput,
  ): Promise<CustomerDomain> {
    const customer = this.repository.create(createCustomerDto)
    const savedCustomer = await this.repository.save(customer)
    return CustomerMapper.toDomain(savedCustomer)
  }

  async findAll(): Promise<CustomerDomain[]> {
    const customers = await this.repository.find()
    return customers.map(CustomerMapper.toDomain)
  }

  async findOne(id: number): Promise<CustomerDomain | null> {
    const customer = await this.repository.findOne({ where: { id } })
    return customer ? CustomerMapper.toDomain(customer) : null
  }

  async findOneByDocument(document: string): Promise<CustomerDomain | null> {
    const customer = await this.repository.findOne({
      where: { documentNumber: Like(`%${document}%`) },
    })
    return customer ? CustomerMapper.toDomain(customer) : null
  }

  async findByEmail(email: string): Promise<CustomerDomain | null> {
    const customer = await this.repository.findOne({ where: { email } })
    return customer ? CustomerMapper.toDomain(customer) : null
  }

  async findByDocument(documentNumber: string): Promise<CustomerDomain | null> {
    const customer = await this.repository.findOne({
      where: { documentNumber: documentNumber },
    })
    return customer ? CustomerMapper.toDomain(customer) : null
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerInput,
  ): Promise<CustomerDomain> {
    await this.repository.update(id, updateCustomerDto)
    const updatedCustomer = await this.repository.findOne({ where: { id } })

    if (!updatedCustomer) {
      throw new CustomException(ErrorMessages.CUSTOMER.NOT_FOUND(id))
    }

    return CustomerMapper.toDomain(updatedCustomer)
  }

  async exists(
    documentNumber: string,
    email: string,
    phone: string | undefined,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }> {
    const existingDocument = await this.repository.findOne({
      where: { documentNumber, id: Not(id || 0) },
    })
    if (existingDocument) {
      return { exists: true, field: 'documentNumber', value: documentNumber }
    }

    const existingEmail = await this.repository.findOne({
      where: { email, id: Not(id || 0) },
    })
    if (existingEmail) {
      return { exists: true, field: 'email', value: email }
    }

    if (phone) {
      const existingPhone = await this.repository.findOne({
        where: { phone, id: Not(id || 0) },
      })
      if (existingPhone) {
        return { exists: true, field: 'phone', value: phone }
      }
    }

    return { exists: false }
  }
}
