import { Injectable } from '@nestjs/common'
import { WorkOrderStatusEnum } from '../../domain/enums/work-order-status.enum'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'
import { FindWorkOrderByIdUseCase } from './find-work-order-by-id.use-case'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CustomException } from '@/common/exceptions/customException'

@Injectable()
export class UpdateWorkOrderStatusUseCase {
  constructor(
    private readonly workOrderRepository: WorkOrderRepositoryPort,
    private readonly findByIdUseCase: FindWorkOrderByIdUseCase,
    private readonly sendEmailQueueProvider: SendEmailQueueProvider,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async execute(id: number, status: WorkOrderStatusEnum) {
    const workOrder = await this.findByIdUseCase.execute(id)

    const validTransitions: Record<WorkOrderStatusEnum, WorkOrderStatusEnum[]> =
      {
        [WorkOrderStatusEnum.RECEIVED]: [WorkOrderStatusEnum.DIAGNOSING],
        [WorkOrderStatusEnum.DIAGNOSING]: [
          WorkOrderStatusEnum.AWAITING_APPROVAL,
        ],
        [WorkOrderStatusEnum.AWAITING_APPROVAL]: [
          WorkOrderStatusEnum.IN_PROGRESS,
        ],
        [WorkOrderStatusEnum.IN_PROGRESS]: [WorkOrderStatusEnum.FINISHED],
        [WorkOrderStatusEnum.FINISHED]: [WorkOrderStatusEnum.DELIVERED],
        [WorkOrderStatusEnum.DELIVERED]: [],
      }

    if (!validTransitions[workOrder.status]?.includes(status)) {
      throw new CustomException(
        `Transição de status inválida: ${workOrder.status} -> ${status}`,
      )
    }

    if (status === WorkOrderStatusEnum.FINISHED) {
      await this.sendEmailQueueProvider.execute({
        recipient: workOrder.customer.email,
        subject: `Ordem de serviço ${workOrder.id} - Finalizada`,
        body: `Finalizada`,
      })
    }

    if (status === WorkOrderStatusEnum.IN_PROGRESS) {
      await Promise.all([
        this.sendEmailQueueProvider.execute({
          recipient: workOrder.customer.email,
          subject: `Ordem de serviço ${workOrder.id} - Em andamento`,
          body: `Em andamento`,
        }),
        this.sendEmailQueueProvider.execute({
          recipient: workOrder.user.email,
          subject: `Ordem de serviço ${workOrder.id} - Confirmada`,
          body: `Confirmada`,
        }),
      ])
    }

    if (
      workOrder.status === WorkOrderStatusEnum.DIAGNOSING &&
      status === WorkOrderStatusEnum.AWAITING_APPROVAL
    ) {
      await this.sendEmailQueueProvider.execute({
        recipient: workOrder.customer.email,
        subject: `Ordem de serviço ${workOrder.id} - Aguardando aprovação`,
        body: `Aguardando aprovação`,
      })
    }

    if (status === WorkOrderStatusEnum.DELIVERED) {
      await this.workOrderRepository.updateFinishedAt(id, new Date())
      await this.sendEmailQueueProvider.execute({
        recipient: workOrder.customer.email,
        subject: `Ordem de serviço ${workOrder.id} - Entregue com sucesso!`,
        body: `Entregue com sucesso`,
      })
    }

    await this.workOrderRepository.updateStatus(id, status)
  }
}
