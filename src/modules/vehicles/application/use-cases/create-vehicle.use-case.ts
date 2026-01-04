import { Injectable, Logger } from '@nestjs/common'
import { VehiclesRepositoryPort } from '../../domain/repositories/vehicles.repository.port'
import { CreateVehicleInput } from '../../domain/interfaces/create-vehicle.input.interface'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'

@Injectable()
export class CreateVehicleUseCase {
  private readonly logger = new Logger(CreateVehicleUseCase.name)

  constructor(private readonly repo: VehiclesRepositoryPort) {}

  async execute(input: CreateVehicleInput): Promise<VehicleDomain> {
    this.logger.log('Criando veículo', input)
    const vehicle = await this.repo.create(input)
    this.logger.log('Veículo criado com sucesso')
    return vehicle
  }
}
