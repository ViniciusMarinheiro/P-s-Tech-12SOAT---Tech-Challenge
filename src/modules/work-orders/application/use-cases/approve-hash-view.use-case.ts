import { Injectable, Logger } from '@nestjs/common'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'
import { FindWorkOrderByHashViewUseCase } from './find-work-orders-by-hash-view.use-case'
import { WorkOrderStatusEnum } from '../../domain/enums/work-order-status.enum'
import { CustomException } from '@/common/exceptions/customException'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'
import { EmailTemplatesUtil } from '@/common/utils/email-templates.util'

@Injectable()
export class ApproveHashViewUseCase {
  private readonly logger = new Logger(ApproveHashViewUseCase.name)

  constructor(
    private readonly workOrderRepository: WorkOrderRepositoryPort,
    private readonly findByHashViewUseCase: FindWorkOrderByHashViewUseCase,
    private readonly sendEmailQueueProvider: SendEmailQueueProvider,
  ) {}

  async execute(hashView: string) {
    this.logger.log('Aprovando ordem de serviço por hash view', { hashView })
    const workOrder = await this.findByHashViewUseCase.execute(hashView)
    if (!workOrder) {
      throw new CustomException(
        `Ordem de serviço não encontrada, verifique se o hash de visualização está correto`,
      )
    }

    if (workOrder.status === WorkOrderStatusEnum.IN_PROGRESS) {
      throw new CustomException(`Ordem de serviço já está em andamento`)
    }

    try {
      await this.workOrderRepository.updateStatus(
        workOrder.id,
        WorkOrderStatusEnum.IN_PROGRESS,
      )

      const templateData =
        EmailTemplatesUtil.prepareEmailTemplateData(workOrder)

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
      this.logger.log('Ordem de serviço aprovada com sucesso')
    } catch (error) {
      throw new CustomException(
        `Erro ao aprovar ordem de serviço, você já aprovou está ordem de serviço`,
      )
    }
  }
}
