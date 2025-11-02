import { VehicleDomain } from '../entities/vehicle.entity'
import { CreateVehicleInput } from '../interfaces/create-vehicle.input.interface'
import { UpdateVehicleInput } from '../interfaces/update-vehicle.input.interface'

export abstract class VehiclesRepositoryPort {
  abstract create(input: CreateVehicleInput): Promise<VehicleDomain>
  abstract findAll(): Promise<VehicleDomain[]>
  abstract findOne(id: number): Promise<VehicleDomain | null>
  abstract findByPlate(plate: string): Promise<VehicleDomain | null>
  abstract findByCustomerId(customerId: number): Promise<VehicleDomain[]>
  abstract update(id: number, input: UpdateVehicleInput): Promise<VehicleDomain>
  abstract exists(
    plate?: string,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }>
}
