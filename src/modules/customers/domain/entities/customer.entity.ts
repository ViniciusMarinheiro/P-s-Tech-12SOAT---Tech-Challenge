export interface CustomerProps {
  id: number
  name: string
  documentNumber: string
  phone: string | null
  email: string
  createdAt: Date
  updatedAt: Date
}

export class CustomerDomain {
  readonly id: number
  readonly name: string
  readonly documentNumber: string
  readonly phone: string | null
  readonly email: string
  readonly createdAt: Date
  readonly updatedAt: Date

  private constructor(props: CustomerProps) {
    this.id = props.id
    this.name = props.name
    this.documentNumber = props.documentNumber
    this.phone = props.phone
    this.email = props.email
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static fromProps(props: CustomerProps): CustomerDomain {
    return new CustomerDomain(props)
  }
}
