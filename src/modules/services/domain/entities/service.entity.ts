export interface ServiceProps {
  id: number
  name: string
  description: string | null
  price: number
  createdAt: Date
}

export class ServiceDomain {
  readonly id: number
  readonly name: string
  readonly description: string | null
  readonly price: number
  readonly createdAt: Date

  private constructor(props: ServiceProps) {
    this.id = props.id
    this.name = props.name
    this.description = props.description
    this.price = props.price
    this.createdAt = props.createdAt
  }

  static fromProps(props: ServiceProps): ServiceDomain {
    return new ServiceDomain(props)
  }
}
