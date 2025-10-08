import { Injectable } from '@nestjs/common'
import { VehiclesRepositoryPort } from '../../domain/repositories/vehicles.repository.port'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'

@Injectable()
export class ListVehiclesUseCase {
  constructor(private readonly repo: VehiclesRepositoryPort) {}

  async execute(): Promise<VehicleDomain[]> {
    return this.repo.findAll()
  }
}
