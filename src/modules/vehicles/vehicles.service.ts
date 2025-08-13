import { Injectable } from '@nestjs/common'
import { CreateVehiclesDto } from './dto/create-vehicles.dto'
import { UpdateVehiclesDto } from './dto/update-vehicles.dto'
import { VehiclesRepositoryPort } from './repositories/port/vehicles.repository.port'
import { VehiclesResponseDto } from './dto/vehicles-response.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { CustomersService } from '../customers/customers.service'

@Injectable()
export class VehiclesService {
  constructor(
    private readonly vehiclesRepository: VehiclesRepositoryPort,
    private readonly customersService: CustomersService,
  ) {}

  async create(
    createVehiclesDto: CreateVehiclesDto,
  ): Promise<VehiclesResponseDto> {
    await this.checkVehiclesExists(
      createVehiclesDto.plate,
      createVehiclesDto.customerId,
      undefined,
    )
    return await this.vehiclesRepository.create(createVehiclesDto)
  }

  async findAll(): Promise<VehiclesResponseDto[]> {
    return await this.vehiclesRepository.findAll()
  }

  async findOne(id: number): Promise<VehiclesResponseDto> {
    const vehicles = await this.vehiclesRepository.findOne(id)
    if (!vehicles) {
      throw new CustomException(ErrorMessages.VEHICLE.NOT_FOUND(id))
    }
    return vehicles
  }

  async update(
    id: number,
    updateVehiclesDto: UpdateVehiclesDto,
  ): Promise<VehiclesResponseDto> {
    await this.checkVehiclesExists(
      updateVehiclesDto.plate,
      updateVehiclesDto.customerId,
      id,
    )
    return await this.vehiclesRepository.update(id, updateVehiclesDto)
  }

  private async checkVehiclesExists(
    plate?: string,
    customerId?: number,
    id?: number,
  ): Promise<void> {
    const existsCheck = await this.vehiclesRepository.exists(plate, id)

    if (customerId) {
      const customerExists = await this.customersService.findOne(customerId)
      if (!customerExists) {
        throw new CustomException(ErrorMessages.CUSTOMER.NOT_FOUND(customerId))
      }
    }

    if (existsCheck.exists) {
      throw new CustomException(
        existsCheck.field === 'plate'
          ? 'Placa já está sendo usada'
          : 'Cliente não encontrado',
      )
    }
  }
}
