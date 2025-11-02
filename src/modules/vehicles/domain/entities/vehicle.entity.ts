export interface VehicleProps {
  id: number
  customerId: number
  plate: string
  brand: string
  model: string
  year: number
  createdAt: Date
  updatedAt: Date
}

export class VehicleDomain {
  readonly id: number
  readonly customerId: number
  readonly plate: string
  readonly brand: string
  readonly model: string
  readonly year: number
  readonly createdAt: Date
  readonly updatedAt: Date

  private constructor(props: VehicleProps) {
    this.id = props.id
    this.customerId = props.customerId
    this.plate = props.plate
    this.brand = props.brand
    this.model = props.model
    this.year = props.year
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static fromProps(props: VehicleProps): VehicleDomain {
    return new VehicleDomain(props)
  }
}
