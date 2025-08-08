import { Injectable, NotFoundException } from '@nestjs/common'
import { WorkOrderRepositoryPort } from './repositories/port/work-order.repository.port'
import { CreateWorkOrderDto } from './dto/create-work-order.dto'
import { UpdateWorkOrderDto } from './dto/update-work-order.dto'
import { WorkOrderResponseDto } from './dto/work-order-response.dto'
import { WorkOrderStatusEnum } from './enum/work-order-status.enum'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { VehiclesService } from '../vehicles/vehicles.service'
import { CustomersService } from '../customers/customers.service'
import { ServicesService } from '../services/services.service'
import { PartsService } from '../parts/parts.service'
import { convertToCents } from '@/common/utils/convert-to-cents'
import { WorkOrderFilterDto } from './dto/work-order-filter.dto'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'

@Injectable()
export class WorkOrdersService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepositoryPort,
    private readonly vehiclesService: VehiclesService,
    private readonly customersService: CustomersService,
    private readonly servicesService: ServicesService,
    private readonly partsService: PartsService,
    private readonly sendEmailQueueProvider: SendEmailQueueProvider,
  ) {}

  async create(
    createWorkOrderDto: CreateWorkOrderDto,
    userId: number,
  ): Promise<void> {
    await this.validateCustomerAndVehicle(
      createWorkOrderDto.customerId,
      createWorkOrderDto.vehicleId,
    )

    let totalAmount = 0

    if (createWorkOrderDto.services) {
      for (const serviceDto of createWorkOrderDto.services) {
        const service = await this.servicesService.findOne(serviceDto.serviceId)

        serviceDto.price = convertToCents(service.price) * serviceDto.quantity
        totalAmount += serviceDto.price
      }
    }

    if (createWorkOrderDto.parts) {
      for (const partDto of createWorkOrderDto.parts) {
        const part = await this.partsService.findOne(partDto.partId)
        partDto.price = convertToCents(part.unitPrice) * partDto.quantity
        totalAmount += partDto.price
      }
    }

    await this.workOrderRepository.create(
      {
        ...createWorkOrderDto,
        userId,
      },
      totalAmount,
    )

    return
  }

  async findById(id: number): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findById(id)
    if (!workOrder) {
      throw new NotFoundException(
        ErrorMessages.WORK_ORDER?.NOT_FOUND?.(id) ||
          `Ordem de serviço com ID ${id} não encontrada`,
      )
    }
    return workOrder
  }

  async findByCustomerId(customerId: number): Promise<WorkOrderResponseDto[]> {
    return await this.workOrderRepository.findByCustomerId(customerId)
  }

  async findByCustomerDocument(
    document: string,
  ): Promise<WorkOrderResponseDto[]> {
    return await this.workOrderRepository.findByCustomerDocument(document)
  }

  async findByVehicleId(vehicleId: number): Promise<WorkOrderResponseDto[]> {
    return await this.workOrderRepository.findByVehicleId(vehicleId)
  }

  async findByStatus(status: string): Promise<WorkOrderResponseDto[]> {
    return await this.workOrderRepository.findByStatus(status)
  }

  async update(
    id: number,
    updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<void> {
    const currentWorkOrder = await this.workOrderRepository.findById(id)
    if (!currentWorkOrder) {
      throw new CustomException(
        ErrorMessages.WORK_ORDER?.NOT_FOUND?.(id) ||
          `Ordem de serviço com ID ${id} não encontrada`,
      )
    }

    if (currentWorkOrder.status !== WorkOrderStatusEnum.RECEIVED) {
      throw new CustomException(
        'Apenas ordens com status RECEIVED podem ser editadas',
      )
    }

    if (updateWorkOrderDto.parts) {
      await this.managePartsStock(
        id,
        currentWorkOrder.parts,
        updateWorkOrderDto.parts,
      )
    }

    if (updateWorkOrderDto.services) {
      await this.updateWorkOrderServices(id, updateWorkOrderDto.services)
    }

    if (updateWorkOrderDto.parts) {
      await this.updateWorkOrderParts(id, updateWorkOrderDto.parts)
    }

    await this.recalculateTotalAmount(id)

    await this.findById(id)
  }

  async delete(id: number): Promise<void> {
    await this.findById(id)

    return this.workOrderRepository.delete(id)
  }

  async findAll(
    workOrderFilterDto: WorkOrderFilterDto,
  ): Promise<WorkOrderResponseDto[]> {
    return await this.workOrderRepository.findAll(workOrderFilterDto)
  }

  async updateStatus(id: number, status: WorkOrderStatusEnum): Promise<void> {
    const workOrder = await this.findById(id)

    await this.validateStatusTransition(id, status)

    if (status === WorkOrderStatusEnum.FINISHED) {
      await this.sendEmailQueueProvider.execute({
        recipient: workOrder.customer.email,
        subject: `Ordem de serviço ${workOrder.id} - Finalizada`,
        body: `A ordem de serviço ${workOrder.id} foi finalizada com sucesso, você pode retirar seu veículo no local!`,
      })
    }

    if (status === WorkOrderStatusEnum.IN_PROGRESS) {
      await Promise.all([
        this.sendEmailQueueProvider.execute({
          recipient: workOrder.customer.email,
          subject: `Ordem de serviço ${workOrder.id} - Em andamento`,
          body: `A ordem de serviço ${workOrder.id} foi iniciada com sucesso, você pode retirar seu veículo no local!`,
        }),
        this.sendEmailQueueProvider.execute({
          recipient: workOrder.user.email,
          subject: `Ordem de serviço ${workOrder.id}`,
          body: `A ordem de serviço ${workOrder.id} foi confirmada e está em andamento`,
        }),
      ])
    }

    await this.workOrderRepository.updateStatus(id, status)
  }

  async findByHashView(hashView: string): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findByHashView(hashView)
    if (!workOrder) {
      throw new CustomException(
        `Ordem de serviço não encontrada, verifique se o hash de visualização está correto`,
      )
    }
    return workOrder
  }

  async getWorkOrderProgress(id: number): Promise<{
    id: number
    status: WorkOrderStatusEnum
    statusDescription: string
    progress: number
    estimatedCompletion?: Date
  }> {
    const workOrder = await this.findById(id)

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

  private async validateStatusTransition(
    id: number,
    newStatus: WorkOrderStatusEnum,
  ): Promise<void> {
    const workOrder = await this.findById(id)
    const currentStatus = workOrder.status

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

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new CustomException(
        `Transição de status inválida: ${currentStatus} -> ${newStatus}`,
      )
    }
  }

  private async validateCustomerAndVehicle(
    customerId: number,
    vehicleId: number,
  ): Promise<void> {
    const customer = await this.customersService.findOne(customerId)
    const vehicle = await this.vehiclesService.findOne(vehicleId)

    if (!customer) {
      throw new CustomException(ErrorMessages.CUSTOMER.NOT_FOUND(customerId))
    }

    if (!vehicle) {
      throw new CustomException(ErrorMessages.VEHICLE.NOT_FOUND(vehicleId))
    }

    if (customer.id !== vehicle.customerId) {
      throw new CustomException('Cliente e veículo não correspondem')
    }
  }

  private async managePartsStock(
    workOrderId: number,
    currentParts: any[],
    newParts: any[],
  ): Promise<void> {
    // Mapear peças atuais por ID
    const currentPartsMap = new Map(
      currentParts.map((part) => [part.partId, part.quantity]),
    )

    // Mapear novas peças por ID
    const newPartsMap = new Map(
      newParts.map((part) => [part.partId, part.quantity]),
    )

    // Para cada peça, calcular a diferença e atualizar estoque
    for (const [partId, newQuantity] of newPartsMap) {
      const currentQuantity = currentPartsMap.get(partId) || 0
      const difference = newQuantity - currentQuantity

      if (difference !== 0) {
        const part = await this.partsService.findOne(partId)
        if (!part) {
          throw new CustomException(`Peça com ID ${partId} não encontrada`)
        }

        // Se está removendo peças, adicionar ao estoque
        if (difference < 0) {
          await this.partsService.update(partId, {
            stock: part.stock + Math.abs(difference),
          })
        }
        // Se está adicionando peças, verificar se há estoque suficiente
        else {
          if (part.stock < difference) {
            throw new CustomException(
              `Estoque insuficiente para a peça ${part.name}. Disponível: ${part.stock}, Necessário: ${difference}`,
            )
          }
          await this.partsService.update(partId, {
            stock: part.stock - difference,
          })
        }
      }
    }

    // Remover peças que não estão mais na lista
    for (const [partId, currentQuantity] of currentPartsMap) {
      if (!newPartsMap.has(partId)) {
        const part = await this.partsService.findOne(partId)
        if (part) {
          await this.partsService.update(partId, {
            stock: part.stock + currentQuantity,
          })
        }
      }
    }
  }

  private async updateWorkOrderServices(
    workOrderId: number,
    services: any[],
  ): Promise<void> {
    // Remover todos os serviços atuais
    await this.workOrderRepository.removeWorkOrderServices(workOrderId)

    // Adicionar novos serviços
    for (const service of services) {
      const serviceData = await this.servicesService.findOne(service.serviceId)
      if (!serviceData) {
        throw new CustomException(
          `Serviço com ID ${service.serviceId} não encontrado`,
        )
      }

      await this.workOrderRepository.addWorkOrderService(workOrderId, {
        serviceId: service.serviceId,
        quantity: service.quantity,
        totalPrice: convertToCents(serviceData.price) * service.quantity,
      })
    }
  }

  private async updateWorkOrderParts(
    workOrderId: number,
    parts: any[],
  ): Promise<void> {
    // Remover todas as peças atuais
    await this.workOrderRepository.removeWorkOrderParts(workOrderId)

    // Adicionar novas peças
    for (const part of parts) {
      const partData = await this.partsService.findOne(part.partId)
      if (!partData) {
        throw new CustomException(`Peça com ID ${part.partId} não encontrada`)
      }

      await this.workOrderRepository.addWorkOrderPart(workOrderId, {
        partId: part.partId,
        quantity: part.quantity,
        totalPrice: convertToCents(partData.unitPrice) * part.quantity,
      })
    }
  }

  private async recalculateTotalAmount(workOrderId: number): Promise<void> {
    const workOrder = await this.findById(workOrderId)

    const servicesTotal = workOrder.services.reduce((acc, service) => {
      return acc + service.totalPrice
    }, 0)

    const partsTotal = workOrder.parts.reduce((acc, part) => {
      return acc + part.totalPrice
    }, 0)

    const totalAmount = servicesTotal + partsTotal

    await this.workOrderRepository.update(workOrderId, {
      totalAmount: totalAmount,
    } as any)
  }
}
