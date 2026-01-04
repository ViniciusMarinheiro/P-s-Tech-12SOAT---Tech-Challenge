import { Injectable, Logger } from '@nestjs/common'
import { VehiclesRepositoryPort } from '../../domain/repositories/vehicles.repository.port'
import { UpdateVehicleInput } from '../../domain/interfaces/update-vehicle.input.interface'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class UpdateVehicleUseCase {
  private readonly logger = new Logger(UpdateVehicleUseCase.name)

  constructor(private readonly repo: VehiclesRepositoryPort) {}

  async execute(id: number, input: UpdateVehicleInput): Promise<VehicleDomain> {
    this.logger.log('Atualizando veículo', { id, ...input })
    const exists = await this.repo.findOne(id)
    if (!exists) {
      throw new CustomException(ErrorMessages.VEHICLE.NOT_FOUND(id))
    }
    const vehicle = await this.repo.update(id, input)
    this.logger.log('Veículo atualizado com sucesso')
    return vehicle
  }
}
