import { Part as OrmPart } from '../database/part.entity'
import { PartDomain } from '../../domain/entities/part.entity'
import { convertToMoney } from '@/common/utils/convert-to-money'

export class PartMapper {
  static toDomain(entity: OrmPart): PartDomain {
    return PartDomain.fromProps({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      stock: entity.stock,
      unitPrice: convertToMoney(entity.unitPrice),
      createdAt: entity.createdAt,
    })
  }
}
