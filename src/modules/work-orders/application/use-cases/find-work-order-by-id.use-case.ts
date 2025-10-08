import { Injectable, NotFoundException } from '@nestjs/common'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class FindWorkOrderByIdUseCase {
  constructor(private readonly workOrderRepository: WorkOrderRepositoryPort) {}

  async execute(id: number) {
    const workOrder = await this.workOrderRepository.findById(id)
    if (!workOrder) {
      throw new NotFoundException(
        ErrorMessages.WORK_ORDER?.NOT_FOUND?.(id) ||
          `Ordem de serviço com ID ${id} não encontrada`,
      )
    }
    return workOrder
  }
}
