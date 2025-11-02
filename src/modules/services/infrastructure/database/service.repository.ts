import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { Service } from './service.entity'
import { CreateServiceInput } from '../../domain/interfaces/create-service.input.interface'
import { UpdateServiceInput } from '../../domain/interfaces/update-service.input.interface'
import { ServiceRepositoryPort } from '../../domain/repositories/service.repository.port'
import { ServiceDomain } from '../../domain/entities/service.entity'
import { ServiceMapper } from '../mappers/service.mapper'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { convertToCents } from '@/common/utils/convert-to-cents'

@Injectable()
export class ServiceRepository extends ServiceRepositoryPort {
  constructor(
    @InjectRepository(Service)
    private readonly repository: Repository<Service>,
  ) {
    super()
  }

  async create(createServiceDto: CreateServiceInput): Promise<ServiceDomain> {
    const service = this.repository.create({
      ...createServiceDto,
      price: convertToCents(createServiceDto.price),
    })
    const savedService = await this.repository.save(service)

    if (!savedService) {
      throw new CustomException(ErrorMessages.SERVICE.NOT_FOUND)
    }

    return ServiceMapper.toDomain(savedService)
  }

  async findAll(): Promise<ServiceDomain[]> {
    const services = await this.repository.find()
    return services.map(ServiceMapper.toDomain)
  }

  async findOne(id: number): Promise<ServiceDomain | null> {
    const service = await this.repository.findOne({
      where: { id },
    })
    return service ? ServiceMapper.toDomain(service) : null
  }

  async findByName(name: string): Promise<ServiceDomain | null> {
    const service = await this.repository.findOne({
      where: { name },
    })
    return service ? ServiceMapper.toDomain(service) : null
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceInput,
  ): Promise<ServiceDomain> {
    await this.repository.update(id, {
      ...updateServiceDto,
      ...(updateServiceDto.price && {
        price: convertToCents(updateServiceDto.price),
      }),
    })
    const updatedService = await this.repository.findOne({ where: { id } })

    if (!updatedService) {
      throw new CustomException(ErrorMessages.SERVICE.NOT_FOUND)
    }

    return ServiceMapper.toDomain(updatedService)
  }

  async exists(
    name?: string,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }> {
    if (name) {
      const existingService = await this.repository.findOne({
        where: { name, id: Not(id || 0) },
      })

      if (existingService) {
        return { exists: true, field: 'name', value: name }
      }
    }

    return { exists: false }
  }
}
