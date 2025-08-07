import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { Service } from '../entities/service.entity'
import { CreateServiceDto } from '../dto/create-service.dto'
import { UpdateServiceDto } from '../dto/update-service.dto'
import { ServiceRepositoryPort } from './port/service.repository.port'
import { ServiceResponseDto } from '../dto/service-response.dto'
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

  async create(
    createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    const service = this.repository.create({
      ...createServiceDto,
      price: convertToCents(createServiceDto.price),
    })
    const savedService = await this.repository.save(service)

    if (!savedService) {
      throw new CustomException(ErrorMessages.SERVICE.NOT_FOUND)
    }

    return savedService
  }

  async findAll(): Promise<ServiceResponseDto[]> {
    const services = await this.repository.find()
    return services
  }

  async findOne(id: number): Promise<ServiceResponseDto | null> {
    return await this.repository.findOne({
      where: { id },
    })
  }

  async findByName(name: string): Promise<ServiceResponseDto | null> {
    return await this.repository.findOne({
      where: { name },
    })
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    await this.repository.update(id, {
      ...updateServiceDto,
      ...(updateServiceDto.price && {
        price: convertToCents(updateServiceDto.price),
      }),
    })
    const updatedService = await this.findOne(id)

    if (!updatedService) {
      throw new CustomException(ErrorMessages.SERVICE.NOT_FOUND)
    }

    return updatedService
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
