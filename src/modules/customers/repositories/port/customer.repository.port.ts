import { Customer } from '../../entities/customer.entity'
import { CreateCustomerDto } from '../../dto/create-customer.dto'
import { UpdateCustomerDto } from '../../dto/update-customer.dto'
import { CustomerResponseDto } from '../../dto/customer-response.dto'

export abstract class CustomerRepositoryPort {
  abstract create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto>
  abstract findAll(): Promise<CustomerResponseDto[]>
  abstract findOne(id: number): Promise<CustomerResponseDto | null>
  abstract findByEmail(email: string): Promise<CustomerResponseDto | null>
  abstract findByDocument(
    documentNumber: string,
  ): Promise<CustomerResponseDto | null>
  abstract update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto>

  abstract exists(
    documentNumber: string,
    email: string,
    phone: string | undefined,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }>
}
