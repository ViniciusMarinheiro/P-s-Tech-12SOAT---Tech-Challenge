import { Injectable } from '@nestjs/common'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { ServiceRepositoryPort } from './repositories/port/service.repository.port'
import { ServiceResponseDto } from './dto/service-response.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { convertToMoney } from '@/common/utils/convert-to-money'

@Injectable()
export class ServicesService {
  constructor(private readonly serviceRepository: ServiceRepositoryPort) {}

  async create(
    createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    await this.checkServiceExists(createServiceDto)
    return await this.serviceRepository.create(createServiceDto)
  }

  async findAll(): Promise<ServiceResponseDto[]> {
    const services = await this.serviceRepository.findAll()
    return services.map((service) => ({
      ...service,
      price: convertToMoney(service.price),
    }))
  }

  async findOne(id: number): Promise<ServiceResponseDto> {
    const service = await this.serviceRepository.findOne(id)
    if (!service) {
      throw new CustomException(ErrorMessages.SERVICE.NOT_FOUND)
    }
    return {
      ...service,
      price: convertToMoney(service.price),
    }
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    await this.checkServiceExists(
      {
        name: updateServiceDto.name || '',
        description: updateServiceDto.description || '',
        price: updateServiceDto.price || 0,
      },
      id,
    )
    return await this.serviceRepository.update(id, updateServiceDto)
  }

  private async checkServiceExists(
    createServiceDto: CreateServiceDto,
    id?: number,
  ): Promise<void> {
    const existsCheck = await this.serviceRepository.exists(
      createServiceDto.name,
      id,
    )

    if (existsCheck.exists) {
      const fieldName = existsCheck.field === 'name' ? 'nome' : 'campo'
      throw new CustomException(`${fieldName} já está sendo usado`)
    }
  }
}
