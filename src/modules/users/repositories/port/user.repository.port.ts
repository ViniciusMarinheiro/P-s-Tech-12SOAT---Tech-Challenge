import { UpdateUserDto } from '../../dto/update-user.dto'
import { CreateUserDto } from '../../dto/create-user.dto'
import { UserResponseDto } from '../../dto/user-response.dto'
import { UserResponsePasswordDto } from '../../dto/user-response-password.dto'

export abstract class UserRepositoryPort {
  abstract findByEmail(email: string): Promise<UserResponseDto | null>
  abstract findByEmailAndPassword(
    email: string,
  ): Promise<UserResponsePasswordDto | null>
  abstract findById(id: number): Promise<UserResponseDto | null>
  abstract create(createUserDto: CreateUserDto): Promise<UserResponseDto>
  abstract update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto>
  abstract delete(id: number): Promise<void>
  abstract findAll(): Promise<UserResponseDto[]>
}
