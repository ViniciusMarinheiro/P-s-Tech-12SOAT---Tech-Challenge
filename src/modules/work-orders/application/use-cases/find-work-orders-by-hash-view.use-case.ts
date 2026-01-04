import { Injectable, Logger } from '@nestjs/common'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'

@Injectable()
export class FindWorkOrderByHashViewUseCase {
  private readonly logger = new Logger(FindWorkOrderByHashViewUseCase.name)

  constructor(private readonly workOrderRepository: WorkOrderRepositoryPort) {}

  async execute(hashView: string) {
    this.logger.log('Buscando ordem de serviço por hash view', { hashView })
    return this.workOrderRepository.findByHashView(hashView)
  }
}
