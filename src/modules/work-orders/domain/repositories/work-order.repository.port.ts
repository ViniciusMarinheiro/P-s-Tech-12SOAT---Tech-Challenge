import { WorkOrderStatusEnum } from '../enums/work-order-status.enum'
import { CreateWorkOrderDto } from '../../infrastructure/web/dto/create-work-order.dto'
import { UpdateWorkOrderDto } from '../../infrastructure/web/dto/update-work-order.dto'
import { WorkOrderFilterDto } from '../../infrastructure/web/dto/work-order-filter.dto'
import { WorkOrder } from '../entities/work-order.entity'

export abstract class WorkOrderRepositoryPort {
  abstract create(
    createWorkOrderDto: CreateWorkOrderDto,
    totalAmount: number,
  ): Promise<WorkOrder>

  abstract findById(id: number): Promise<WorkOrder | null>

  abstract findByCustomerId(customerId: number): Promise<WorkOrder[]>

  abstract findByCustomerDocument(document: string): Promise<WorkOrder[]>

  abstract findByVehicleId(vehicleId: number): Promise<WorkOrder[]>

  abstract findByStatus(status: string): Promise<WorkOrder[]>

  abstract update(
    id: number,
    updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<WorkOrder>

  abstract delete(id: number): Promise<void>

  abstract findAll(filter: WorkOrderFilterDto): Promise<WorkOrder[]>

  abstract updateStatus(
    id: number,
    status: WorkOrderStatusEnum | string,
  ): Promise<WorkOrder>

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

  abstract findByHashView(hashView: string): Promise<WorkOrder | null>
  abstract updateFinishedAt(id: number, finishedAt: Date): Promise<WorkOrder>
}
