import { Injectable, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource, In, Like } from 'typeorm'
import { WorkOrder } from '../entities/work-order.entity'
import { WorkOrderStatusEnum } from '../enum/work-order-status.enum'
import { WorkOrderService } from '../entities/work-order-service.entity'
import { WorkOrderPart } from '../entities/work-order-part.entity'
import { WorkOrderRepositoryPort } from './port/work-order.repository.port'
import { CreateWorkOrderDto } from '../dto/create-work-order.dto'
import { UpdateWorkOrderDto } from '../dto/update-work-order.dto'
import {
  WorkOrderResponseDto,
  WorkOrderServiceResponseDto,
  WorkOrderPartResponseDto,
} from '../dto/work-order-response.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { Service } from '@/modules/services/entities/service.entity'
import { Part } from '@/modules/parts/entities/part.entity'
import { convertToMoney } from '@/common/utils/convert-to-money'
import { WorkOrderFilterDto } from '../dto/work-order-filter.dto'
import { generateUniqueHash } from '@/common/utils/generate-unique-hash.util'

@Injectable()
export class WorkOrderRepository extends WorkOrderRepositoryPort {
  private readonly workOrderRelations = [
    'customer',
    'vehicle',
    'workOrderServices',
    'workOrderParts',
    'workOrderServices.service',
    'workOrderParts.part',
    'user',
  ]

  constructor(
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(WorkOrderService)
    private readonly workOrderServiceRepository: Repository<WorkOrderService>,
    @InjectRepository(WorkOrderPart)
    private readonly workOrderPartRepository: Repository<WorkOrderPart>,
    private readonly dataSource: DataSource,
  ) {
    super()
  }

  private toDto(workOrder: WorkOrder): WorkOrderResponseDto {
    const dto = new WorkOrderResponseDto()
    dto.id = workOrder.id
    dto.customerId = workOrder.customerId
    dto.vehicleId = workOrder.vehicleId
    dto.status = workOrder.status
    dto.totalAmount = workOrder.totalAmount
    dto.createdAt = workOrder.createdAt
    dto.updatedAt = workOrder.updatedAt

    dto.services = []
    dto.parts = []

    return dto
  }

  private mapWorkOrderWithRelations(
    workOrder: WorkOrder,
  ): WorkOrderResponseDto {
    const dto = new WorkOrderResponseDto()
    dto.id = workOrder.id
    dto.customerId = workOrder.customerId
    dto.vehicleId = workOrder.vehicleId
    dto.status = workOrder.status
    dto.totalAmount = convertToMoney(workOrder.totalAmount)
    dto.hashView = workOrder.hashView
    dto.createdAt = workOrder.createdAt
    dto.updatedAt = workOrder.updatedAt

    if (workOrder.customer) {
      dto.customer = {
        id: workOrder.customer.id,
        name: workOrder.customer.name,
        email: workOrder.customer.email,
      }
    }

    if (workOrder.vehicle) {
      dto.vehicle = {
        id: workOrder.vehicle.id,
        plate: workOrder.vehicle.plate,
      }
    }

    if (workOrder.user) {
      dto.user = {
        id: workOrder.user.id,
        name: workOrder.user.name,
        email: workOrder.user.email,
      }
    }

    dto.services =
      workOrder.workOrderServices?.map((service) => ({
        id: service.id,
        serviceId: service.serviceId,
        serviceName: service.service?.name || '',
        quantity: service.quantity,
        unitPrice: convertToMoney(service.service?.price || 0),
        totalPrice: convertToMoney(service.totalPrice),
      })) || []

    dto.parts =
      workOrder.workOrderParts?.map((part) => ({
        id: part.id,
        partId: part.partId,
        partName: part.part?.name || '',
        quantity: part.quantity,
        unitPrice: convertToMoney(part.part?.unitPrice || 0),
        totalPrice: convertToMoney(part.totalPrice),
      })) || []

    return dto
  }

  async create(
    createWorkOrderDto: CreateWorkOrderDto,
    totalAmount: number,
  ): Promise<WorkOrderResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      const workOrder = manager.create(WorkOrder, {
        customerId: createWorkOrderDto.customerId,
        vehicleId: createWorkOrderDto.vehicleId,
        status: WorkOrderStatusEnum.RECEIVED,
        totalAmount,
        userId: createWorkOrderDto.userId,
        hashView: generateUniqueHash(20),
      })

      const savedWorkOrder = await manager.save(WorkOrder, workOrder)

      const workOrderServices: WorkOrderService[] = []

      const workOrderParts: WorkOrderPart[] = []
      const partsUpdatedQuantity: { partId: number; quantity: number }[] = []

      if (
        createWorkOrderDto.services &&
        createWorkOrderDto.services.length > 0
      ) {
        for (const serviceDto of createWorkOrderDto.services) {
          workOrderServices.push(
            manager.create(WorkOrderService, {
              workOrderId: savedWorkOrder.id,
              serviceId: serviceDto.serviceId,
              quantity: serviceDto.quantity,
              totalPrice: serviceDto.price,
            }),
          )
        }
      }

      if (createWorkOrderDto.parts && createWorkOrderDto.parts.length > 0) {
        const partIds = createWorkOrderDto.parts.map((p) => p.partId)
        const parts = await manager.find(Part, { where: { id: In(partIds) } })

        for (const partDto of createWorkOrderDto.parts) {
          const part = parts.find((p) => p.id === partDto.partId)
          if (!part) {
            throw new CustomException(
              `Peça com ID ${partDto.partId} não encontrada`,
            )
          }

          if (part.stock < partDto.quantity) {
            throw new CustomException(
              `Estoque insuficiente para a peça ${part.name}. Disponível: ${part.stock}, Solicitado: ${partDto.quantity}`,
            )
          }

          workOrderParts.push(
            manager.create(WorkOrderPart, {
              workOrderId: savedWorkOrder.id,
              partId: partDto.partId,
              quantity: partDto.quantity,
              totalPrice: partDto.price,
            }),
          )
          partsUpdatedQuantity.push({
            partId: partDto.partId,
            quantity: partDto.quantity,
          })
        }
      }

      if (workOrderServices.length > 0) {
        await manager.save(WorkOrderService, workOrderServices)
      }

      if (workOrderParts.length > 0) {
        await manager.save(WorkOrderPart, workOrderParts)
      }

      if (partsUpdatedQuantity.length > 0) {
        const caseStatements = partsUpdatedQuantity
          .map(
            (_, index) =>
              `WHEN id = $${index * 2 + 1} THEN stock - $${index * 2 + 2}`,
          )
          .join(' ')

        const params = partsUpdatedQuantity.flatMap((part) => [
          part.partId,
          part.quantity,
        ])

        const inParams = partsUpdatedQuantity
          .map((_, index) => `$${params.length + index + 1}`)
          .join(',')

        await manager.query(
          `UPDATE parts SET stock = CASE ${caseStatements} ELSE stock END WHERE id IN (${inParams})`,
          [...params, ...partsUpdatedQuantity.map((p) => p.partId)],
        )
      }

      return this.toDto(savedWorkOrder)
    })
  }

  async findById(id: number): Promise<WorkOrderResponseDto | null> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
      relations: this.workOrderRelations,
    })
    return workOrder ? this.mapWorkOrderWithRelations(workOrder) : null
  }

  async findByCustomerId(customerId: number): Promise<WorkOrderResponseDto[]> {
    const workOrders = await this.workOrderRepository.find({
      where: { customerId },
      relations: this.workOrderRelations,
    })
    return workOrders.map((workOrder) =>
      this.mapWorkOrderWithRelations(workOrder),
    )
  }

  async findByCustomerDocument(
    document: string,
  ): Promise<WorkOrderResponseDto[]> {
    const workOrders = await this.workOrderRepository
      .createQueryBuilder('workOrder')
      .leftJoinAndSelect('workOrder.customer', 'customer')
      .leftJoinAndSelect('workOrder.vehicle', 'vehicle')
      .leftJoinAndSelect('workOrder.workOrderServices', 'workOrderServices')
      .leftJoinAndSelect('workOrderServices.service', 'service')
      .leftJoinAndSelect('workOrder.workOrderParts', 'workOrderParts')
      .leftJoinAndSelect('workOrderParts.part', 'part')
      .leftJoinAndSelect('workOrder.user', 'user')
      .where('customer.documentNumber LIKE :document', {
        document: `%${document}%`,
      })
      .getMany()

    return workOrders.map((workOrder) =>
      this.mapWorkOrderWithRelations(workOrder),
    )
  }

  async findByVehicleId(vehicleId: number): Promise<WorkOrderResponseDto[]> {
    const workOrders = await this.workOrderRepository.find({
      where: { vehicleId },
      relations: this.workOrderRelations,
    })
    return workOrders.map((workOrder) =>
      this.mapWorkOrderWithRelations(workOrder),
    )
  }

  async findByStatus(status: string): Promise<WorkOrderResponseDto[]> {
    const workOrders = await this.workOrderRepository.find({
      where: { status: status as WorkOrderStatusEnum },
      relations: this.workOrderRelations,
    })
    return workOrders.map((workOrder) =>
      this.mapWorkOrderWithRelations(workOrder),
    )
  }

  async update(
    id: number,
    updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<WorkOrderResponseDto> {
    await this.workOrderRepository.update(id, updateWorkOrderDto as any)
    const updatedWorkOrder = await this.workOrderRepository.findOne({
      where: { id },
    })

    if (!updatedWorkOrder) {
      throw new CustomException(
        ErrorMessages.WORK_ORDER?.NOT_FOUND?.(id) ||
          `Ordem de serviço com ID ${id} não encontrada`,
      )
    }

    return this.toDto(updatedWorkOrder)
  }

  async delete(id: number): Promise<void> {
    const workOrder = await this.workOrderRepository.findOne({ where: { id } })
    if (!workOrder) {
      throw new CustomException(
        ErrorMessages.WORK_ORDER?.NOT_FOUND?.(id) ||
          `Ordem de serviço com ID ${id} não encontrada`,
      )
    }
    await this.workOrderRepository.remove(workOrder)
  }

  async findAll(
    workOrderFilterDto: WorkOrderFilterDto,
  ): Promise<WorkOrderResponseDto[]> {
    const { id, status, customerId, vehicleId, customerDocument } =
      workOrderFilterDto

    // Construir where dinamicamente baseado nos filtros preenchidos
    const whereConditions: any = {}

    if (id !== undefined && id !== null) {
      whereConditions.id = id
    }

    if (status !== undefined && status !== null) {
      whereConditions.status = status
    }

    if (customerId !== undefined && customerId !== null) {
      whereConditions.customerId = customerId
    }

    if (vehicleId !== undefined && vehicleId !== null) {
      whereConditions.vehicleId = vehicleId
    }

    // Se há filtro por documento do cliente, usar query builder para join
    if (customerDocument && customerDocument.trim() !== '') {
      whereConditions.customer = {
        documentNumber: Like(`%${customerDocument}%`),
      }
    }

    // Se não há filtro por documento, usar find simples
    const workOrders = await this.workOrderRepository.find({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : {},
      relations: this.workOrderRelations,
    })

    return workOrders.map((workOrder) =>
      this.mapWorkOrderWithRelations(workOrder),
    )
  }

  async updateStatus(
    id: number,
    status: string,
  ): Promise<WorkOrderResponseDto> {
    await this.workOrderRepository.update(id, {
      status: status as WorkOrderStatusEnum,
    })
    const updatedWorkOrder = await this.workOrderRepository.findOne({
      where: { id },
    })

    if (!updatedWorkOrder) {
      throw new CustomException(
        ErrorMessages.WORK_ORDER?.NOT_FOUND?.(id) ||
          `Ordem de serviço com ID ${id} não encontrada`,
      )
    }

    return this.toDto(updatedWorkOrder)
  }

  async removeWorkOrderServices(workOrderId: number): Promise<void> {
    await this.workOrderServiceRepository.delete({ workOrderId })
  }

  async addWorkOrderService(
    workOrderId: number,
    serviceData: { serviceId: number; quantity: number; totalPrice: number },
  ): Promise<void> {
    const workOrderService = this.workOrderServiceRepository.create({
      workOrderId,
      serviceId: serviceData.serviceId,
      quantity: serviceData.quantity,
      totalPrice: serviceData.totalPrice,
    })
    await this.workOrderServiceRepository.save(workOrderService)
  }

  async removeWorkOrderParts(workOrderId: number): Promise<void> {
    await this.workOrderPartRepository.delete({ workOrderId })
  }

  async addWorkOrderPart(
    workOrderId: number,
    partData: { partId: number; quantity: number; totalPrice: number },
  ): Promise<void> {
    const workOrderPart = this.workOrderPartRepository.create({
      workOrderId,
      partId: partData.partId,
      quantity: partData.quantity,
      totalPrice: partData.totalPrice,
    })
    await this.workOrderPartRepository.save(workOrderPart)
  }

  async findByHashView(hashView: string): Promise<WorkOrderResponseDto | null> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { hashView },
      relations: this.workOrderRelations,
    })
    return workOrder ? this.mapWorkOrderWithRelations(workOrder) : null
  }

  async updateFinishedAt(id: number, finishedAt: Date): Promise<WorkOrderResponseDto> {
    await this.workOrderRepository.update(id, { finishedAt })
    const updatedWorkOrder = await this.workOrderRepository.findOne({
      where: { id },
      relations: this.workOrderRelations,
    })

    if (!updatedWorkOrder) {
      throw new CustomException(
        ErrorMessages.WORK_ORDER?.NOT_FOUND?.(id) ||
          `Ordem de serviço com ID ${id} não encontrada`,
      )
    }

    return this.mapWorkOrderWithRelations(updatedWorkOrder)
  }
}
