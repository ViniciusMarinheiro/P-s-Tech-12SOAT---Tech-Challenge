import { UserRole } from '../../../auth/enums/user-role.enum'

export interface UpdateUserInput {
  name?: string
  email?: string
  password?: string
  role?: UserRole
}
