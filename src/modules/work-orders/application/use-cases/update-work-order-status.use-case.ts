import { Injectable } from '@nestjs/common'
import { WorkOrderStatusEnum } from '../../domain/enums/work-order-status.enum'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'
import { FindWorkOrderByIdUseCase } from './find-work-order-by-id.use-case'
import { CustomException } from '@/common/exceptions/customException'
import { EmailTemplatesUtil } from '@/common/utils/email-templates.util'

@Injectable()
export class UpdateWorkOrderStatusUseCase {
  constructor(
    private readonly workOrderRepository: WorkOrderRepositoryPort,
    private readonly findByIdUseCase: FindWorkOrderByIdUseCase,
    private readonly sendEmailQueueProvider: SendEmailQueueProvider,
  ) {}

  async execute(id: number, status: WorkOrderStatusEnum) {
    const workOrder = await this.findByIdUseCase.execute(id)

    this.validateStatusTransition(workOrder.status, status)

    const templateData = EmailTemplatesUtil.prepareEmailTemplateData(workOrder)

    if (status === WorkOrderStatusEnum.FINISHED) {
      await this.sendEmailQueueProvider.execute({
        recipient: workOrder.customer!.email,
        subject: `Ordem de serviço ${workOrder.id} - Finalizada`,
        body: EmailTemplatesUtil.generateFinishedTemplate(templateData),
      })
    }

    if (status === WorkOrderStatusEnum.IN_PROGRESS) {
      await Promise.all([
        this.sendEmailQueueProvider.execute({
          recipient: workOrder.customer!.email,
          subject: `Ordem de serviço ${workOrder.id} - Em andamento`,
          body: EmailTemplatesUtil.generateInProgressCustomerTemplate(
            templateData,
          ),
        }),
        this.sendEmailQueueProvider.execute({
          recipient: workOrder.user!.email,
          subject: `Ordem de serviço ${workOrder.id} - Confirmada`,
          body: EmailTemplatesUtil.generateInProgressUserTemplate(templateData),
        }),
      ])
    }

    if (
      workOrder.status === WorkOrderStatusEnum.DIAGNOSING &&
      status === WorkOrderStatusEnum.AWAITING_APPROVAL
    ) {
      await this.sendEmailQueueProvider.execute({
        recipient: workOrder.customer!.email,
        subject: `Ordem de serviço ${workOrder.id} - Aguardando aprovação`,
        body: EmailTemplatesUtil.generateAwaitingApprovalTemplate(templateData),
      })
    }

    if (status === WorkOrderStatusEnum.DELIVERED) {
      await this.workOrderRepository.updateFinishedAt(id, new Date())
      await this.sendEmailQueueProvider.execute({
        recipient: workOrder.customer!.email,
        subject: `Ordem de serviço ${workOrder.id} - Entregue com sucesso!`,
        body: EmailTemplatesUtil.generateDeliveredTemplate(templateData),
      })
    }

    await this.workOrderRepository.updateStatus(id, status)
  }

  private validateStatusTransition(
    currentStatus: WorkOrderStatusEnum,
    status: WorkOrderStatusEnum,
  ) {
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
        [WorkOrderStatusEnum.REJECTED]: [],
      }

    if (!validTransitions[currentStatus]?.includes(status)) {
      throw new CustomException(
        `Transição de status inválida: ${currentStatus} -> ${status}`,
      )
    }
  }
}
