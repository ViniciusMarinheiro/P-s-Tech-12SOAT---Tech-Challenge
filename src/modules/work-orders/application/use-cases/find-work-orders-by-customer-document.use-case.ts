import { Injectable } from '@nestjs/common'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'

@Injectable()
export class FindWorkOrdersByCustomerDocumentUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepositoryPort) {}

  async execute(document: string) {
    return this.workOrderRepository.findByCustomerDocument(document)
  }
}
