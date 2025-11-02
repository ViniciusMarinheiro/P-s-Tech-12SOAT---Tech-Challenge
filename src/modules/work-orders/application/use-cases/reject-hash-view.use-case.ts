import { Injectable } from '@nestjs/common'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'
import { FindWorkOrderByHashViewUseCase } from './find-work-orders-by-hash-view.use-case'
import { WorkOrderStatusEnum } from '../../domain/enums/work-order-status.enum'
import { CustomException } from '@/common/exceptions/customException'

@Injectable()
export class RejectHashViewUseCase {
  constructor(
    private readonly workOrderRepository: WorkOrderRepositoryPort,
    private readonly findByHashViewUseCase: FindWorkOrderByHashViewUseCase,
  ) {}

  async execute(hashView: string) {
    const workOrder = await this.findByHashViewUseCase.execute(hashView)
    if (!workOrder) {
      throw new CustomException(
        `Ordem de serviço não encontrada, verifique se o hash de visualização está correto`,
      )
    }
    try {
      await this.workOrderRepository.updateStatus(
        workOrder.id,
        WorkOrderStatusEnum.REJECTED,
      )
    } catch (error) {
      throw new CustomException(
        `Erro ao rejeitar ordem de serviço, você já rejeitou está ordem de serviço`,
      )
    }
  }
}
