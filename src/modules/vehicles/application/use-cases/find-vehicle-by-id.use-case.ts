import { Injectable, Logger } from '@nestjs/common'
import { VehiclesRepositoryPort } from '../../domain/repositories/vehicles.repository.port'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class FindVehicleByIdUseCase {
  private readonly logger = new Logger(FindVehicleByIdUseCase.name)

  constructor(private readonly repo: VehiclesRepositoryPort) {}

  async execute(id: number): Promise<VehicleDomain> {
    this.logger.log('Buscando veículo por ID', { id })
    const v = await this.repo.findOne(id)
    if (!v) {
      throw new CustomException(ErrorMessages.VEHICLE.NOT_FOUND(id))
    }
    return v
  }
}
