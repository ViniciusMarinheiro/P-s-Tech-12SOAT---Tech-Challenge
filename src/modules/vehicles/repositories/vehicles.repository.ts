import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { CreateVehiclesDto } from '../dto/create-vehicles.dto'
import { UpdateVehiclesDto } from '../dto/update-vehicles.dto'
import { VehiclesRepositoryPort } from './port/vehicles.repository.port'
import { VehiclesResponseDto } from '../dto/vehicles-response.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { Vehicle } from '../entities/vehicle.entity'

@Injectable()
export class VehiclesRepository extends VehiclesRepositoryPort {
  constructor(
    @InjectRepository(Vehicle)
    private readonly repository: Repository<Vehicle>,
  ) {
    super()
  }

  async create(
    createVehiclesDto: CreateVehiclesDto,
  ): Promise<VehiclesResponseDto> {
    const vehicle = this.repository.create(createVehiclesDto)
    const savedVehicle = await this.repository.save(vehicle)

    const vehicleWithCustomer = await this.repository.findOne({
      where: { id: savedVehicle.id },
      relations: ['customer'],
    })

    if (!vehicleWithCustomer) {
      throw new CustomException(
        ErrorMessages.VEHICLE.NOT_FOUND(savedVehicle.id),
      )
    }

    return vehicleWithCustomer
  }

  async findAll(): Promise<VehiclesResponseDto[]> {
    const vehicles = await this.repository.find({
      relations: ['customer'],
    })

    return vehicles
  }

  async findOne(id: number): Promise<VehiclesResponseDto | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['customer'],
    })
  }

  async findByPlate(plate: string): Promise<VehiclesResponseDto | null> {
    return await this.repository.findOne({
      where: { plate },
      relations: ['customer'],
    })
  }

  async findByCustomerId(customerId: number): Promise<VehiclesResponseDto[]> {
    return await this.repository.find({
      where: { customerId },
      relations: ['customer'],
    })
  }

  async update(
    id: number,
    updateVehiclesDto: UpdateVehiclesDto,
  ): Promise<VehiclesResponseDto> {
    await this.repository.update(id, updateVehiclesDto)
    const updatedVehicle = await this.findOne(id)

    if (!updatedVehicle) {
      throw new CustomException(ErrorMessages.VEHICLE.NOT_FOUND(id))
    }

    return updatedVehicle
  }

  async exists(
    plate?: string,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }> {
    if (plate) {
      const existingPlate = await this.repository.findOne({
        where: { plate: plate, id: Not(id || 0) },
      })

      if (existingPlate) {
        return { exists: true, field: 'plate', value: plate }
      }
    }

    return { exists: false }
  }
}
