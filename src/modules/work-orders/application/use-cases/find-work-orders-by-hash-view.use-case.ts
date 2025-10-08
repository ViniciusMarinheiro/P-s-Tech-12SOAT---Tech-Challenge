import { Injectable } from '@nestjs/common'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'

@Injectable()
export class FindWorkOrderByHashViewUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepositoryPort) {}

  async execute(hashView: string) {
    return this.workOrderRepository.findByHashView(hashView)
  }
}
