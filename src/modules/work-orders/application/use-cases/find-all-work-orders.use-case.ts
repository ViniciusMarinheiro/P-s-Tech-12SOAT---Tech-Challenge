import { Injectable, Logger } from '@nestjs/common'
import { WorkOrderFilterDto } from '../../infrastructure/web/dto/work-order-filter.dto'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'

@Injectable()
export class FindAllWorkOrdersUseCase {
  private readonly logger = new Logger(FindAllWorkOrdersUseCase.name)

  constructor(private readonly workOrderRepository: WorkOrderRepositoryPort) {}

  async execute(filter: WorkOrderFilterDto) {
    this.logger.log('Listando ordens de serviço', filter)
    const workOrders = await this.workOrderRepository.findAll(filter)
    this.logger.log('Ordens de serviço listadas com sucesso', {
      count: workOrders.length,
    })
    return workOrders
  }
}
