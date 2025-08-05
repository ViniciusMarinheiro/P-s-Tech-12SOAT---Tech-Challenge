import { User } from '../../entities/user.entity'
import { UpdateUserDto } from '../../dto/update-user.dto'
import { CreateUserDto } from '../../dto/create-user.dto'

export abstract class UserRepositoryPort {
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: number): Promise<User | null>
  abstract create(createUserDto: CreateUserDto): Promise<User>
  abstract update(id: number, updateUserDto: UpdateUserDto): Promise<User>
  abstract delete(id: number): Promise<void>
  abstract findAll(): Promise<User[]>
}
