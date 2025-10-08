import { Injectable } from '@nestjs/common'
import { WorkOrderFilterDto } from '../../infrastructure/web/dto/work-order-filter.dto'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'

@Injectable()
export class FindAllWorkOrdersUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepositoryPort) {}

  async execute(filter: WorkOrderFilterDto) {
    return this.workOrderRepository.findAll(filter)
  }
}
