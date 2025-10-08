import { CreateServiceInput } from '../interfaces/create-service.input.interface'
import { UpdateServiceInput } from '../interfaces/update-service.input.interface'
import { ServiceDomain } from '../entities/service.entity'

export abstract class ServiceRepositoryPort {
  abstract create(input: CreateServiceInput): Promise<ServiceDomain>
  abstract findAll(): Promise<ServiceDomain[]>
  abstract findOne(id: number): Promise<ServiceDomain | null>
  abstract findByName(name: string): Promise<ServiceDomain | null>
  abstract update(id: number, input: UpdateServiceInput): Promise<ServiceDomain>
  abstract exists(
    name?: string,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }>
}
