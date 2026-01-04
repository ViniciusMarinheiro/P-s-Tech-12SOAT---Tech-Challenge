import { Injectable, Logger } from '@nestjs/common'
import { CreateWorkOrderDto } from '../../infrastructure/web/dto/create-work-order.dto'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'
import { FindServiceByIdUseCase } from '@/modules/services/application/use-cases/find-service-by-id.use-case'
import { FindPartByIdUseCase } from '@/modules/parts/application/use-cases/find-part-by-id.use-case'
import { FindCustomerByIdUseCase } from '@/modules/customers/application/use-cases/find-customer-by-id.use-case'
import { FindVehicleByIdUseCase } from '@/modules/vehicles/application/use-cases/find-vehicle-by-id.use-case'
import { convertToCents } from '@/common/utils/convert-to-cents'
import { CustomException } from '@/common/exceptions/customException'
import { ProtocolGenerator } from '../../../../common/utils/protocol-generator.util'

@Injectable()
export class CreateWorkOrderUseCase {
  private readonly logger = new Logger(CreateWorkOrderUseCase.name)

  constructor(
    private readonly workOrderRepository: WorkOrderRepositoryPort,
    private readonly findVehicleByIdUseCase: FindVehicleByIdUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
    private readonly findServiceByIdUseCase: FindServiceByIdUseCase,
    private readonly findPartByIdUseCase: FindPartByIdUseCase,
  ) {}

  async execute(
    dto: CreateWorkOrderDto,
    userId: number,
  ): Promise<{
    protocol: string
  }> {
    this.logger.log('Criando ordem de serviço', { ...dto, userId })
    const customer = await this.findCustomerByIdUseCase.execute(dto.customerId)
    const vehicle = await this.findVehicleByIdUseCase.execute(dto.vehicleId)
    if (!customer) {
      throw new CustomException(
        `Cliente com ID ${dto.customerId} não encontrado`,
      )
    }
    if (!vehicle) {
      throw new CustomException(
        `Veículo com ID ${dto.vehicleId} não encontrado`,
      )
    }
    if (customer.id !== vehicle.customerId) {
      throw new CustomException('Cliente e veículo não correspondem')
    }

    let totalAmount = 0

    if (dto.services) {
      for (const serviceDto of dto.services) {
        const service = await this.findServiceByIdUseCase.execute(
          serviceDto.serviceId,
        )
        serviceDto.price = convertToCents(service.price) * serviceDto.quantity
        totalAmount += serviceDto.price
      }
    }

    if (dto.parts) {
      for (const partDto of dto.parts) {
        const part = await this.findPartByIdUseCase.execute(partDto.partId)
        partDto.price = convertToCents(part.unitPrice) * partDto.quantity
        totalAmount += partDto.price
      }
    }

    const workOrder = await this.workOrderRepository.create(
      { ...dto, userId },
      totalAmount,
    )

    this.logger.log('Ordem de serviço criada com sucesso')
    return { protocol: workOrder.protocol }
  }
}
