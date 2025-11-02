import { WorkOrderStatusEnum } from '../enums/work-order-status.enum'
import { WorkOrderService } from './work-order-service.entity'
import { WorkOrderPart } from './work-order-part.entity'

export interface WorkOrderProps {
  id: number
  customerId: number
  vehicleId: number
  userId: number
  hashView: string
  protocol: string
  status: WorkOrderStatusEnum
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  startedAt: Date
  finishedAt?: Date
  services?: WorkOrderService[]
  parts?: WorkOrderPart[]
  customer?: { id: number; name: string; email: string }
  user?: { id: number; name: string; email: string }
  vehicle?: { id: number; plate: string; model: string; brand: string }
}

export class WorkOrder {
  readonly id: number
  readonly customerId: number
  readonly vehicleId: number
  readonly userId: number
  readonly hashView: string
  readonly protocol: string
  readonly status: WorkOrderStatusEnum
  readonly totalAmount: number
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly startedAt: Date
  readonly finishedAt?: Date
  readonly services?: WorkOrderService[]
  readonly parts?: WorkOrderPart[]
  readonly customer?: { id: number; name: string; email: string }
  readonly user?: { id: number; name: string; email: string }
  readonly vehicle?: { id: number; plate: string; model: string; brand: string }

  private constructor(props: WorkOrderProps) {
    this.id = props.id
    this.customerId = props.customerId
    this.vehicleId = props.vehicleId
    this.userId = props.userId
    this.hashView = props.hashView
    this.protocol = props.protocol
    this.status = props.status
    this.totalAmount = props.totalAmount
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
    this.startedAt = props.startedAt
    this.finishedAt = props.finishedAt
    this.services = props.services
    this.parts = props.parts
    this.customer = props.customer
    this.user = props.user
    this.vehicle = props.vehicle
  }

  static fromProps(props: WorkOrderProps): WorkOrder {
    return new WorkOrder(props)
  }
}
