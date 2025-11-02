import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource, In, Like, Not } from 'typeorm'
import { WorkOrder } from './work-order.entity'
import { WorkOrderStatusEnum } from '../../domain/enums/work-order-status.enum'
import { WorkOrderService } from './work-order-service.entity'
import { WorkOrderPart } from './work-order-part.entity'
import { WorkOrderRepositoryPort } from '../../domain/repositories/work-order.repository.port'
import { CreateWorkOrderDto } from '../web/dto/create-work-order.dto'
import { UpdateWorkOrderDto } from '../web/dto/update-work-order.dto'
import { WorkOrder as DomainWorkOrder } from '../../domain/entities/work-order.entity'
import { WorkOrderDomainMapper } from '../mappers/work-order.mapper'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { Part } from '@/modules/parts/infrastructure/database/part.entity'
import { WorkOrderFilterDto } from '../web/dto/work-order-filter.dto'
import { generateUniqueHash } from '@/common/utils/generate-unique-hash.util'
import { ProtocolGenerator } from '../../../../common/utils/protocol-generator.util'
import { Max } from 'class-validator'

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

  async create(
    createWorkOrderDto: CreateWorkOrderDto,
    totalAmount: number,
  ): Promise<DomainWorkOrder> {
    return await this.dataSource.transaction(async (manager) => {
      const workOrderLastId = await manager.find(WorkOrder, {
        order: { id: 'DESC' },
        take: 1,
      })

      const workOrder = manager.create(WorkOrder, {
        customerId: createWorkOrderDto.customerId,
        vehicleId: createWorkOrderDto.vehicleId,
        status: WorkOrderStatusEnum.RECEIVED,
        totalAmount,
        userId: createWorkOrderDto.userId,
        hashView: generateUniqueHash(20),
        protocol: ProtocolGenerator.generateProtocol(
          workOrderLastId[0] ? workOrderLastId[0].id + 1 : 1,
        ),
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

      const updatedWorkOrder = await manager.findOne(WorkOrder, {
        where: { id: savedWorkOrder.id },
      })

      return WorkOrderDomainMapper.toDomain(updatedWorkOrder!)
    })
  }

  async findById(id: number): Promise<DomainWorkOrder | null> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id },
      relations: this.workOrderRelations,
    })
    return workOrder ? WorkOrderDomainMapper.withRelations(workOrder) : null
  }

  async findByCustomerId(customerId: number): Promise<DomainWorkOrder[]> {
    const workOrders = await this.workOrderRepository.find({
      where: { customerId },
      relations: this.workOrderRelations,
    })
    return workOrders.map((wo) => WorkOrderDomainMapper.withRelations(wo))
  }

  async findByCustomerDocument(document: string): Promise<DomainWorkOrder[]> {
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

    return workOrders.map((wo) => WorkOrderDomainMapper.withRelations(wo))
  }

  async findByVehicleId(vehicleId: number): Promise<DomainWorkOrder[]> {
    const workOrders = await this.workOrderRepository.find({
      where: { vehicleId },
      relations: this.workOrderRelations,
    })
    return workOrders.map((wo) => WorkOrderDomainMapper.withRelations(wo))
  }

  async findByStatus(status: string): Promise<DomainWorkOrder[]> {
    const workOrders = await this.workOrderRepository.find({
      where: { status: status as WorkOrderStatusEnum },
      relations: this.workOrderRelations,
    })
    return workOrders.map((wo) => WorkOrderDomainMapper.withRelations(wo))
  }

  async update(
    id: number,
    updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<DomainWorkOrder> {
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

    return WorkOrderDomainMapper.toDomain(updatedWorkOrder)
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
  ): Promise<DomainWorkOrder[]> {
    const { id, status, customerId, vehicleId, customerDocument } =
      workOrderFilterDto

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

    if (customerDocument && customerDocument.trim() !== '') {
      whereConditions.customer = {
        documentNumber: Like(`%${customerDocument}%`),
      }
    }

    if (status === undefined || status === null) {
      whereConditions.status = Not(
        In([WorkOrderStatusEnum.FINISHED, WorkOrderStatusEnum.DELIVERED]),
      )
    }

    const workOrders = await this.workOrderRepository
      .createQueryBuilder('workOrder')
      .leftJoinAndSelect('workOrder.customer', 'customer')
      .leftJoinAndSelect('workOrder.vehicle', 'vehicle')
      .leftJoinAndSelect('workOrder.user', 'user')
      .leftJoinAndSelect('workOrder.workOrderServices', 'workOrderServices')
      .leftJoinAndSelect('workOrderServices.service', 'service')
      .leftJoinAndSelect('workOrder.workOrderParts', 'workOrderParts')
      .leftJoinAndSelect('workOrderParts.part', 'part')
      .where(whereConditions)
      .orderBy(
        `CASE 
          WHEN workOrder.status = '${WorkOrderStatusEnum.IN_PROGRESS}' THEN 1
          WHEN workOrder.status = '${WorkOrderStatusEnum.AWAITING_APPROVAL}' THEN 2
          WHEN workOrder.status = '${WorkOrderStatusEnum.DIAGNOSING}' THEN 3
          WHEN workOrder.status = '${WorkOrderStatusEnum.RECEIVED}' THEN 4
          WHEN workOrder.status = '${WorkOrderStatusEnum.REJECTED}' THEN 5
          ELSE 999
        END`,
        'ASC',
      )
      .addOrderBy('workOrder.createdAt', 'ASC')
      .getMany()

    return workOrders.map((wo) => WorkOrderDomainMapper.withRelations(wo))
  }

  async updateStatus(id: number, status: string): Promise<DomainWorkOrder> {
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

    return WorkOrderDomainMapper.toDomain(updatedWorkOrder)
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

  async findByHashView(hashView: string): Promise<DomainWorkOrder | null> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { hashView },
      relations: this.workOrderRelations,
    })
    return workOrder ? WorkOrderDomainMapper.withRelations(workOrder) : null
  }

  async updateFinishedAt(
    id: number,
    finishedAt: Date,
  ): Promise<DomainWorkOrder> {
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

    return WorkOrderDomainMapper.withRelations(updatedWorkOrder)
  }
}
