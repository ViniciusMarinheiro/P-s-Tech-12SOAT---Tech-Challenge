import { Injectable, Logger } from '@nestjs/common'
import { ServiceRepositoryPort } from '../../domain/repositories/service.repository.port'
import { ServiceDomain } from '../../domain/entities/service.entity'
import { convertToMoney } from '@/common/utils/convert-to-money'

@Injectable()
export class ListServicesUseCase {
  private readonly logger = new Logger(ListServicesUseCase.name)

  constructor(private readonly repo: ServiceRepositoryPort) {}

  async execute(): Promise<ServiceDomain[]> {
    this.logger.log('Listando serviços')
    const services = await this.repo.findAll()
    this.logger.log('Serviços listados com sucesso', { count: services.length })
    return services
  }
}
