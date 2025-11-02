import { Service as OrmService } from '../database/service.entity'
import { ServiceDomain } from '../../domain/entities/service.entity'
import { convertToMoney } from '@/common/utils/convert-to-money'

export class ServiceMapper {
  static toDomain(entity: OrmService): ServiceDomain {
    return ServiceDomain.fromProps({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: convertToMoney(entity.price),
      createdAt: entity.createdAt,
    })
  }
}
