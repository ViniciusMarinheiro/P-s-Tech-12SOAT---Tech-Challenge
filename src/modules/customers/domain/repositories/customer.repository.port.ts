import { CreateCustomerInput } from '../interfaces/create-customer.input.interface'
import { UpdateCustomerInput } from '../interfaces/update-customer.input.interface'
import { CustomerDomain } from '../entities/customer.entity'

export abstract class CustomerRepositoryPort {
  abstract create(input: CreateCustomerInput): Promise<CustomerDomain>
  abstract findAll(): Promise<CustomerDomain[]>
  abstract findOne(id: number): Promise<CustomerDomain | null>
  abstract findByEmail(email: string): Promise<CustomerDomain | null>
  abstract findByDocument(
    documentNumber: string,
  ): Promise<CustomerDomain | null>
  abstract findOneByDocument(document: string): Promise<CustomerDomain | null>
  abstract update(
    id: number,
    input: UpdateCustomerInput,
  ): Promise<CustomerDomain>
  abstract exists(
    documentNumber: string,
    email: string,
    phone: string | undefined,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }>
}
