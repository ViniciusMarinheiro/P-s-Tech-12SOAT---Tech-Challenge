import { Injectable } from '@nestjs/common'
import { VehiclesRepositoryPort } from '../../domain/repositories/vehicles.repository.port'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'

@Injectable()
export class FindVehicleByPlateUseCase {
  constructor(private readonly repo: VehiclesRepositoryPort) {}

  async execute(plate: string): Promise<VehicleDomain | null> {
    return this.repo.findByPlate(plate)
  }
}
