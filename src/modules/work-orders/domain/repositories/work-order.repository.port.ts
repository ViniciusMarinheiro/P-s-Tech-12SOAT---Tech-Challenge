import { WorkOrderStatusEnum } from '../enums/work-order-status.enum'
import { CreateWorkOrderDto } from '../../infrastructure/web/dto/create-work-order.dto'
import { UpdateWorkOrderDto } from '../../infrastructure/web/dto/update-work-order.dto'
import { WorkOrderResponseDto } from '../../infrastructure/web/dto/work-order-response.dto'
import { WorkOrderFilterDto } from '../../infrastructure/web/dto/work-order-filter.dto'

export abstract class WorkOrderRepositoryPort {
  abstract create(
    createWorkOrderDto: CreateWorkOrderDto,
    totalAmount: number,
  ): Promise<WorkOrderResponseDto>

  abstract findById(id: number): Promise<WorkOrderResponseDto | null>

  abstract findByCustomerId(customerId: number): Promise<WorkOrderResponseDto[]>

  abstract findByCustomerDocument(
    document: string,
  ): Promise<WorkOrderResponseDto[]>

  abstract findByVehicleId(vehicleId: number): Promise<WorkOrderResponseDto[]>

  abstract findByStatus(status: string): Promise<WorkOrderResponseDto[]>

  abstract update(
    id: number,
    updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<WorkOrderResponseDto>

  abstract delete(id: number): Promise<void>

  abstract findAll(filter: WorkOrderFilterDto): Promise<WorkOrderResponseDto[]>

  abstract updateStatus(
    id: number,
    status: WorkOrderStatusEnum | string,
  ): Promise<WorkOrderResponseDto>

  abstract removeWorkOrderServices(workOrderId: number): Promise<void>
  abstract addWorkOrderService(
    workOrderId: number,
    serviceData: { serviceId: number; quantity: number; totalPrice: number },
  ): Promise<void>

  abstract removeWorkOrderParts(workOrderId: number): Promise<void>
  abstract addWorkOrderPart(
    workOrderId: number,
    partData: { partId: number; quantity: number; totalPrice: number },
  ): Promise<void>

  abstract findByHashView(
    hashView: string,
  ): Promise<WorkOrderResponseDto | null>
  abstract updateFinishedAt(
    id: number,
    finishedAt: Date,
  ): Promise<WorkOrderResponseDto>
}
