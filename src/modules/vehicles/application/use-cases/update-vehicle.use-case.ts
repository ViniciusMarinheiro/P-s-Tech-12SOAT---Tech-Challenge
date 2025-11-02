import { Injectable } from '@nestjs/common'
import { VehiclesRepositoryPort } from '../../domain/repositories/vehicles.repository.port'
import { UpdateVehicleInput } from '../../domain/interfaces/update-vehicle.input.interface'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class UpdateVehicleUseCase {
  constructor(private readonly repo: VehiclesRepositoryPort) {}

  async execute(id: number, input: UpdateVehicleInput): Promise<VehicleDomain> {
    const exists = await this.repo.findOne(id)
    if (!exists) {
      throw new CustomException(ErrorMessages.VEHICLE.NOT_FOUND(id))
    }
    return this.repo.update(id, input)
  }
}
