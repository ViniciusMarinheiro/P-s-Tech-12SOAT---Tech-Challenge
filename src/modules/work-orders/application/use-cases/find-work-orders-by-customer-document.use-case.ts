import { Injectable, Logger } from '@nestjs/common'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'

@Injectable()
export class FindWorkOrdersByCustomerDocumentUseCase {
  private readonly logger = new Logger(FindWorkOrdersByCustomerDocumentUseCase.name)

  constructor(private readonly workOrderRepository: WorkOrderRepositoryPort) {}

  async execute(document: string) {
    this.logger.log('Buscando ordens de serviço por documento do cliente', {
      document,
    })
    return this.workOrderRepository.findByCustomerDocument(document)
  }
}
