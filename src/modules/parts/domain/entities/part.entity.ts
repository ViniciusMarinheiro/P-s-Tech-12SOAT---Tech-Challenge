export interface PartProps {
  id: number
  name: string
  description: string | null
  stock: number
  unitPrice: number
  createdAt: Date
}

export class PartDomain {
  readonly id: number
  readonly name: string
  readonly description: string | null
  readonly stock: number
  readonly unitPrice: number
  readonly createdAt: Date

  private constructor(props: PartProps) {
    this.id = props.id
    this.name = props.name
    this.description = props.description
    this.stock = props.stock
    this.unitPrice = props.unitPrice
    this.createdAt = props.createdAt
  }

  static fromProps(props: PartProps): PartDomain {
    return new PartDomain(props)
  }
}
