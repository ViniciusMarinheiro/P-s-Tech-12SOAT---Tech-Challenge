export interface WorkOrderPartProps {
  id: number
  partId: number
  partName?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export class WorkOrderPart {
  readonly id: number
  readonly partId: number
  readonly partName?: string
  readonly quantity: number
  readonly unitPrice: number
  readonly totalPrice: number

  private constructor(props: WorkOrderPartProps) {
    this.id = props.id
    this.partId = props.partId
    this.partName = props.partName
    this.quantity = props.quantity
    this.unitPrice = props.unitPrice
    this.totalPrice = props.totalPrice
  }

  static fromProps(props: WorkOrderPartProps): WorkOrderPart {
    return new WorkOrderPart(props)
  }
}
