import { Injectable, Logger } from '@nestjs/common'
import { VehiclesRepositoryPort } from '../../domain/repositories/vehicles.repository.port'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'

@Injectable()
export class ListVehiclesUseCase {
  private readonly logger = new Logger(ListVehiclesUseCase.name)

  constructor(private readonly repo: VehiclesRepositoryPort) {}

  async execute(): Promise<VehicleDomain[]> {
    this.logger.log('Listando veículos')
    const vehicles = await this.repo.findAll()
    this.logger.log('Veículos listados com sucesso', { count: vehicles.length })
    return vehicles
  }
}
