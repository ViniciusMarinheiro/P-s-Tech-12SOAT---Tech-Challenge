import { Injectable, Logger } from '@nestjs/common'
import { VehiclesRepositoryPort } from '../../domain/repositories/vehicles.repository.port'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'

@Injectable()
export class FindVehicleByPlateUseCase {
  private readonly logger = new Logger(FindVehicleByPlateUseCase.name)

  constructor(private readonly repo: VehiclesRepositoryPort) {}

  async execute(plate: string): Promise<VehicleDomain | null> {
    this.logger.log('Buscando veículo por placa', { plate })
    return this.repo.findByPlate(plate)
  }
}
