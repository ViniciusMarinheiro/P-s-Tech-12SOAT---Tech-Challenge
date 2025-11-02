import { UserRole } from '@/modules/auth/domain/enums/user-role.enum'

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role?: UserRole
}
