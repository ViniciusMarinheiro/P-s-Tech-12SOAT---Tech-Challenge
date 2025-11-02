import { UserRole } from '@/modules/auth/domain/enums/user-role.enum'
import { User } from '../../domain/entities/user.entity'

export function makeUserDomain(overrides?: Partial<User>): User {
  const now = new Date()
  return User.fromProps({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.ATTENDANT,
    createdAt: now,
    updatedAt: now,
    ...(overrides as any),
  })
}
