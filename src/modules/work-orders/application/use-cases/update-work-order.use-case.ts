import { Injectable } from '@nestjs/common'
import { UpdateWorkOrderDto } from '../../infrastructure/web/dto/update-work-order.dto'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'
import { CustomException } from '@/common/exceptions/customException'
import { FindServiceByIdUseCase } from '@/modules/services/application/use-cases/find-service-by-id.use-case'
import { FindPartByIdUseCase } from '@/modules/parts/application/use-cases/find-part-by-id.use-case'
import { convertToCents } from '@/common/utils/convert-to-cents'
import { FindWorkOrderByIdUseCase } from './find-work-order-by-id.use-case'
import { WorkOrderStatusEnum } from '../../domain/enums/work-order-status.enum'

@Injectable()
export class UpdateWorkOrderUseCase {
  constructor(
    private readonly workOrderRepository: WorkOrderRepositoryPort,
    private readonly findServiceByIdUseCase: FindServiceByIdUseCase,
    private readonly findPartByIdUseCase: FindPartByIdUseCase,
    private readonly findByIdUseCase: FindWorkOrderByIdUseCase,
  ) {}

  async execute(id: number, dto: UpdateWorkOrderDto) {
    const currentWorkOrder = await this.findByIdUseCase.execute(id)

    if (currentWorkOrder.status !== WorkOrderStatusEnum.RECEIVED) {
      throw new CustomException(
        'Apenas ordens com status RECEIVED podem ser editadas',
      )
    }

    if (dto.parts) {
      // First remove then add parts
      await this.workOrderRepository.removeWorkOrderParts(id)
      for (const part of dto.parts) {
        const partData = await this.findPartByIdUseCase.execute(part.partId)
        if (!partData) {
          throw new CustomException(`Peça com ID ${part.partId} não encontrada`)
        }
        await this.workOrderRepository.addWorkOrderPart(id, {
          partId: part.partId,
          quantity: part.quantity,
          totalPrice: convertToCents(partData.unitPrice) * part.quantity,
        })
      }
    }

    if (dto.services) {
      await this.workOrderRepository.removeWorkOrderServices(id)
      for (const service of dto.services) {
        const serviceData = await this.findServiceByIdUseCase.execute(
          service.serviceId,
        )
        if (!serviceData) {
          throw new CustomException(
            `Serviço com ID ${service.serviceId} não encontrado`,
          )
        }
        await this.workOrderRepository.addWorkOrderService(id, {
          serviceId: service.serviceId,
          quantity: service.quantity,
          totalPrice: convertToCents(serviceData.price) * service.quantity,
        })
      }
    }

    // Recalculate total amount
    const updated = await this.workOrderRepository.findById(id)
    let servicesTotal = 0
    let partsTotal = 0
    updated?.services?.forEach((s: any) => (servicesTotal += s.totalPrice))
    updated?.parts?.forEach((p: any) => (partsTotal += p.totalPrice))
    const totalAmount = servicesTotal + partsTotal

    await this.workOrderRepository.update(id, { ...dto, totalAmount } as any)
    return this.findByIdUseCase.execute(id)
  }
}
