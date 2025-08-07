import { Injectable } from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerRepositoryPort } from './repositories/port/customer.repository.port'
import { CustomerResponseDto } from './dto/customer-response.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class CustomersService {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    await this.checkCustomerExists(createCustomerDto)
    return await this.customerRepository.create(createCustomerDto)
  }

  async findAll(): Promise<CustomerResponseDto[]> {
    return await this.customerRepository.findAll()
  }

  async findOne(id: number): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findOne(id)
    if (!customer) {
      throw new CustomException(ErrorMessages.CUSTOMER.NOT_FOUND(id))
    }
    return customer
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    await this.checkCustomerExists(
      {
        name: updateCustomerDto.name || '',
        documentNumber: updateCustomerDto.documentNumber || '',
        email: updateCustomerDto.email || '',
        phone: updateCustomerDto.phone || '',
      },
      id,
    )
    return await this.customerRepository.update(id, updateCustomerDto)
  }

  private async checkCustomerExists(
    createCustomerDto: CreateCustomerDto,
    id?: number,
  ): Promise<void> {
    const existsCheck = await this.customerRepository.exists(
      createCustomerDto.documentNumber,
      createCustomerDto.email,
      createCustomerDto.phone,
      id,
    )

    if (existsCheck.exists) {
      const fieldName =
        existsCheck.field === 'documentNumber'
          ? 'CPF/CNPJ'
          : existsCheck.field === 'email'
            ? 'email'
            : 'telefone'
      throw new CustomException(`${fieldName} já está sendo usado`)
    }
  }
}
