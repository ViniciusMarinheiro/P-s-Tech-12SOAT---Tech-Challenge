import { UserRole } from '../../../auth/enums/user-role.enum'

export interface UserProps {
  id: number
  name: string
  email: string
  password?: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export class User {
  readonly id: number
  readonly name: string
  readonly email: string
  readonly password?: string
  readonly role: UserRole
  readonly createdAt: Date
  readonly updatedAt: Date

  private constructor(props: UserProps) {
    this.id = props.id
    this.name = props.name
    this.email = props.email
    this.password = props.password
    this.role = props.role
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }

  static fromProps(props: UserProps): User {
    return new User(props)
  }
}
