import { UpdateUserDto } from '../../dto/update-user.dto'
import { CreateUserDto } from '../../dto/create-user.dto'
import { UserResponseDto } from '../../dto/user-response.dto'

export abstract class UserRepositoryPort {
  abstract findByEmail(email: string): Promise<UserResponseDto | null>
  abstract findById(id: number): Promise<UserResponseDto | null>
  abstract create(createUserDto: CreateUserDto): Promise<UserResponseDto>
  abstract update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto>
  abstract delete(id: number): Promise<void>
  abstract findAll(): Promise<UserResponseDto[]>
}
