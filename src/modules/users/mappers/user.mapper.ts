import { User } from '../entities/user.entity'
import { UserResponseDto } from '../dto/user-response.dto'

export class UserMapper {
  static toDto(user: User): UserResponseDto {
    const dto = new UserResponseDto()
    dto.id = user.id
    dto.name = user.name
    dto.email = user.email
    dto.role = user.role
    dto.createdAt = user.createdAt
    dto.updatedAt = user.updatedAt
    return dto
  }

  static toDtoList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toDto(user))
  }

  static toAuthUser(user: User): {
    id: number
    name: string
    email: string
    role: string
  } {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }
}
