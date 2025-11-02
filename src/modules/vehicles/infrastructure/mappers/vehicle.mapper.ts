import { Vehicle as OrmVehicle } from '../database/vehicle.entity'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'

export class VehicleMapper {
  static toDomain(entity: OrmVehicle): VehicleDomain {
    return VehicleDomain.fromProps({
      id: entity.id,
      customerId: entity.customerId,
      plate: entity.plate,
      brand: entity.brand,
      model: entity.model,
      year: entity.year,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }
}
