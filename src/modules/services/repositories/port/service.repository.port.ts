import { CreateServiceDto } from '../../dto/create-service.dto'
import { UpdateServiceDto } from '../../dto/update-service.dto'
import { ServiceResponseDto } from '../../dto/service-response.dto'

export abstract class ServiceRepositoryPort {
  abstract create(
    createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto>
  abstract findAll(): Promise<ServiceResponseDto[]>
  abstract findOne(id: number): Promise<ServiceResponseDto | null>
  abstract findByName(name: string): Promise<ServiceResponseDto | null>
  abstract update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto>

  abstract exists(
    name?: string,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }>
}
