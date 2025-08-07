import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { Customer } from '../entities/customer.entity'
import { CreateCustomerDto } from '../dto/create-customer.dto'
import { UpdateCustomerDto } from '../dto/update-customer.dto'
import { CustomerRepositoryPort } from './port/customer.repository.port'
import { CustomerResponseDto } from '../dto/customer-response.dto'
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
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const customer = this.repository.create(createCustomerDto)
    return await this.repository.save(customer)
  }

  async findAll(): Promise<CustomerResponseDto[]> {
    return await this.repository.find()
  }

  async findOne(id: number): Promise<CustomerResponseDto | null> {
    return await this.repository.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<CustomerResponseDto | null> {
    return await this.repository.findOne({ where: { email } })
  }

  async findByDocument(
    documentNumber: string,
  ): Promise<CustomerResponseDto | null> {
    return await this.repository.findOne({
      where: { documentNumber: documentNumber },
    })
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    await this.repository.update(id, updateCustomerDto)
    const updatedCustomer = await this.findOne(id)

    if (!updatedCustomer) {
      throw new CustomException(ErrorMessages.CUSTOMER.NOT_FOUND(id))
    }

    return updatedCustomer
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
