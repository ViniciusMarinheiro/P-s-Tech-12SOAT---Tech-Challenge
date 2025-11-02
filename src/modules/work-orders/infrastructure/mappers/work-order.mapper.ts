import { WorkOrder as OrmWorkOrder } from '../database/work-order.entity'
import { WorkOrderPart as OrmWorkOrderPart } from '../database/work-order-part.entity'
import { WorkOrderService as OrmWorkOrderService } from '../database/work-order-service.entity'
import { WorkOrder } from '../../domain/entities/work-order.entity'
import { WorkOrderPart } from '../../domain/entities/work-order-part.entity'
import { WorkOrderService } from '../../domain/entities/work-order-service.entity'
import { convertToMoney } from '@/common/utils/convert-to-money'

export class WorkOrderDomainMapper {
  static toDomain(wo: OrmWorkOrder): WorkOrder {
    return WorkOrder.fromProps({
      id: wo.id,
      customerId: wo.customerId,
      vehicleId: wo.vehicleId,
      userId: wo.userId,
      hashView: wo.hashView,
      protocol: wo.protocol,
      status: wo.status,
      totalAmount: convertToMoney(wo.totalAmount),
      createdAt: wo.createdAt,
      updatedAt: wo.updatedAt,
      startedAt: wo.startedAt,
      finishedAt: wo.finishedAt,
    })
  }

  static withRelations(wo: OrmWorkOrder): WorkOrder {
    const services: WorkOrderService[] =
      (wo.workOrderServices || []).map((s: OrmWorkOrderService) =>
        WorkOrderService.fromProps({
          id: s.id,
          serviceId: s.serviceId,
          serviceName: s.service?.name || '',
          quantity: s.quantity,
          unitPrice: convertToMoney(s.service?.price || 0),
          totalPrice: convertToMoney(s.totalPrice),
        }),
      ) || []

    const parts: WorkOrderPart[] =
      (wo.workOrderParts || []).map((p: OrmWorkOrderPart) =>
        WorkOrderPart.fromProps({
          id: p.id,
          partId: p.partId,
          partName: p.part?.name || '',
          quantity: p.quantity,
          unitPrice: convertToMoney(p.part?.unitPrice || 0),
          totalPrice: convertToMoney(p.totalPrice),
        }),
      ) || []

    const domain = WorkOrder.fromProps({
      id: wo.id,
      customerId: wo.customerId,
      vehicleId: wo.vehicleId,
      userId: wo.userId,
      hashView: wo.hashView,
      protocol: wo.protocol,
      status: wo.status,
      totalAmount: convertToMoney(wo.totalAmount),
      createdAt: wo.createdAt,
      updatedAt: wo.updatedAt,
      startedAt: wo.startedAt,
      finishedAt: wo.finishedAt,
      services,
      parts,
      customer: {
        id: wo.customer!.id,
        name: wo.customer!.name,
        email: wo.customer!.email,
      },
      user: {
        id: wo.user!.id,
        name: wo.user!.name,
        email: wo.user!.email,
      },
      vehicle: {
        id: wo.vehicle!.id,
        plate: wo.vehicle!.plate,
        model: wo.vehicle!.model,
        brand: wo.vehicle!.brand,
      },
    })

    return domain
  }
}
