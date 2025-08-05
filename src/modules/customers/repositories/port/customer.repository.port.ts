import { Customer } from '../../entities/customer.entity'
import { CreateCustomerDto } from '../../dto/create-customer.dto'
import { UpdateCustomerDto } from '../../dto/update-customer.dto'

export abstract class CustomerRepositoryPort {
  abstract create(createCustomerDto: CreateCustomerDto): Promise<Customer>
  abstract findAll(): Promise<Customer[]>
  abstract findOne(id: number): Promise<Customer | null>
  abstract findByEmail(email: string): Promise<Customer | null>
  abstract findByDocument(documentNumber: string): Promise<Customer | null>
  abstract update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer>
  abstract remove(id: number): Promise<void>
  abstract exists(id: number): Promise<boolean>
}
