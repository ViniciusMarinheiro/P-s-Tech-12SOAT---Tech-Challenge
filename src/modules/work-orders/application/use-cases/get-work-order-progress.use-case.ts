import { Injectable } from '@nestjs/common'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'
import { FindWorkOrderByIdUseCase } from './find-work-order-by-id.use-case'
import { WorkOrderStatusEnum } from '../../domain/enums/work-order-status.enum'

@Injectable()
export class GetWorkOrderProgressUseCase {
  constructor(
    private readonly workOrderRepository: WorkOrderRepositoryPort,
    private readonly findByIdUseCase: FindWorkOrderByIdUseCase,
  ) {}

  async execute(id: number) {
    const workOrder = await this.findByIdUseCase.execute(id)

    const statusProgress = {
      [WorkOrderStatusEnum.RECEIVED]: 10,
      [WorkOrderStatusEnum.DIAGNOSING]: 30,
      [WorkOrderStatusEnum.AWAITING_APPROVAL]: 50,
      [WorkOrderStatusEnum.IN_PROGRESS]: 70,
      [WorkOrderStatusEnum.FINISHED]: 90,
      [WorkOrderStatusEnum.DELIVERED]: 100,
    }

    const statusDescriptions = {
      [WorkOrderStatusEnum.RECEIVED]: 'Ordem recebida',
      [WorkOrderStatusEnum.DIAGNOSING]: 'Em diagnóstico',
      [WorkOrderStatusEnum.AWAITING_APPROVAL]: 'Aguardando aprovação',
      [WorkOrderStatusEnum.IN_PROGRESS]: 'Em execução',
      [WorkOrderStatusEnum.FINISHED]: 'Finalizada',
      [WorkOrderStatusEnum.DELIVERED]: 'Entregue',
    }

    return {
      id: workOrder.id,
      status: workOrder.status,
      statusDescription: statusDescriptions[workOrder.status],
      progress: statusProgress[workOrder.status],
    }
  }
}
