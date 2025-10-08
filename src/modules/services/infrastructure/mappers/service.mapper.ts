import { Service as OrmService } from '../database/service.entity'
import { ServiceDomain } from '../../domain/entities/service.entity'

export class ServiceMapper {
  static toDomain(entity: OrmService): ServiceDomain {
    return ServiceDomain.fromProps({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      createdAt: entity.createdAt,
    })
  }
}
