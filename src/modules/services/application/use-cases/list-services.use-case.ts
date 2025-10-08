import { Injectable } from '@nestjs/common'
import { ServiceRepositoryPort } from '../../domain/repositories/service.repository.port'
import { ServiceDomain } from '../../domain/entities/service.entity'
import { convertToMoney } from '@/common/utils/convert-to-money'

@Injectable()
export class ListServicesUseCase {
  constructor(private readonly repo: ServiceRepositoryPort) {}

  async execute(): Promise<ServiceDomain[]> {
    const services = await this.repo.findAll()
    return services.map((s) => ({ ...s, price: convertToMoney(s.price) }))
  }
}
