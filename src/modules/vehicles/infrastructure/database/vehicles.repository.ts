import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Vehicle as OrmVehicle } from './vehicle.entity'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'
import { CreateVehicleInput } from '../../domain/interfaces/create-vehicle.input.interface'
import { UpdateVehicleInput } from '../../domain/interfaces/update-vehicle.input.interface'
import { VehicleMapper } from '../mappers/vehicle.mapper'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { VehiclesRepositoryPort } from '../../domain/repositories/vehicles.repository.port'

@Injectable()
export class VehiclesRepository extends VehiclesRepositoryPort {
  constructor(
    @InjectRepository(OrmVehicle)
    private readonly repository: Repository<OrmVehicle>,
  ) {
    super()
  }

  async create(input: CreateVehicleInput): Promise<VehicleDomain> {
    const entity = this.repository.create(input as unknown as OrmVehicle)
    const saved = await this.repository.save(entity as unknown as OrmVehicle)
    const reloaded = await this.repository.findOne({ where: { id: saved.id } })
    if (!reloaded) {
      throw new CustomException(ErrorMessages.VEHICLE.NOT_FOUND(saved.id))
    }
    return VehicleMapper.toDomain(reloaded)
  }

  async findAll(): Promise<VehicleDomain[]> {
    const items = await this.repository.find()
    return items.map((i) => VehicleMapper.toDomain(i))
  }

  async findOne(id: number): Promise<VehicleDomain | null> {
    const item = await this.repository.findOne({ where: { id } })
    return item ? VehicleMapper.toDomain(item) : null
  }

  async findByPlate(plate: string): Promise<VehicleDomain | null> {
    const item = await this.repository.findOne({ where: { plate } })
    return item ? VehicleMapper.toDomain(item) : null
  }

  async findByCustomerId(customerId: number): Promise<VehicleDomain[]> {
    const items = await this.repository.find({ where: { customerId } })
    return items.map((i) => VehicleMapper.toDomain(i))
  }

  async update(id: number, input: UpdateVehicleInput): Promise<VehicleDomain> {
    await this.repository.update(id, input)
    const updated = await this.repository.findOne({ where: { id } })
    if (!updated) {
      throw new CustomException(ErrorMessages.VEHICLE.NOT_FOUND(id))
    }
    return VehicleMapper.toDomain(updated)
  }

  async exists(
    plate?: string,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }> {
    if (plate) {
      const existingPlate = await this.repository.findOne({
        where: { plate: plate },
      })
      if (existingPlate && existingPlate.id !== (id || 0)) {
        return { exists: true, field: 'plate', value: plate }
      }
    }
    return { exists: false }
  }
}
