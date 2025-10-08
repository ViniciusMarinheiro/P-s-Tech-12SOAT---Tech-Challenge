import { Injectable } from '@nestjs/common'
import { VehiclesRepositoryPort } from '../../domain/repositories/vehicles.repository.port'
import { CreateVehicleInput } from '../../domain/interfaces/create-vehicle.input.interface'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'

@Injectable()
export class CreateVehicleUseCase {
  constructor(private readonly repo: VehiclesRepositoryPort) {}

  async execute(input: CreateVehicleInput): Promise<VehicleDomain> {
    return this.repo.create(input)
  }
}
