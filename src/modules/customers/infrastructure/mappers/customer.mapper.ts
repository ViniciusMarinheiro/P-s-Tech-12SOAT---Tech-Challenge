import { Customer as OrmCustomer } from '../database/customer.entity'
import { CustomerDomain } from '../../domain/entities/customer.entity'

export class CustomerMapper {
  static toDomain(entity: OrmCustomer): CustomerDomain {
    return CustomerDomain.fromProps({
      id: entity.id,
      name: entity.name,
      documentNumber: entity.documentNumber,
      phone: entity.phone,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }
}
