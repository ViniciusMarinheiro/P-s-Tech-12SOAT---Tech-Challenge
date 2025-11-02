import { User as OrmUser } from '../database/user.entity'
import { User } from '../../domain/entities/user.entity'

export class UserMapper {
  static toDomain(entity: OrmUser): User {
    return User.fromProps({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }
}
