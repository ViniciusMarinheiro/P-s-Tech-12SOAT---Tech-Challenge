import { CreateVehiclesDto } from '../../dto/create-vehicles.dto'
import { UpdateVehiclesDto } from '../../dto/update-vehicles.dto'
import { VehiclesResponseDto } from '../../dto/vehicles-response.dto'

export abstract class VehiclesRepositoryPort {
  abstract create(
    createVehiclesDto: CreateVehiclesDto,
  ): Promise<VehiclesResponseDto>
  abstract findAll(): Promise<VehiclesResponseDto[]>
  abstract findOne(id: number): Promise<VehiclesResponseDto | null>
  abstract findByPlate(plate: string): Promise<VehiclesResponseDto | null>
  abstract findByCustomerId(customerId: number): Promise<VehiclesResponseDto[]>
  abstract update(
    id: number,
    updateVehiclesDto: UpdateVehiclesDto,
  ): Promise<VehiclesResponseDto>

  abstract exists(
    plate?: string,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }>
}
