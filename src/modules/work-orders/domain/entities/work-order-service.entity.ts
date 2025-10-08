export interface WorkOrderServiceProps {
  id: number
  serviceId: number
  serviceName?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export class WorkOrderService {
  readonly id: number
  readonly serviceId: number
  readonly serviceName?: string
  readonly quantity: number
  readonly unitPrice: number
  readonly totalPrice: number

  private constructor(props: WorkOrderServiceProps) {
    this.id = props.id
    this.serviceId = props.serviceId
    this.serviceName = props.serviceName
    this.quantity = props.quantity
    this.unitPrice = props.unitPrice
    this.totalPrice = props.totalPrice
  }

  static fromProps(props: WorkOrderServiceProps): WorkOrderService {
    return new WorkOrderService(props)
  }
}
