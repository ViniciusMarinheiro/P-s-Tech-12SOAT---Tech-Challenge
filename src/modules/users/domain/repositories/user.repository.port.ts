import { User } from '../entities/user.entity'
import { CreateUserInput } from '../interfaces/create-user.input.interface'
import { UpdateUserInput } from '../interfaces/update-user.input.interface'

export abstract class UserRepositoryPort {
  abstract findByEmail(email: string): Promise<User | null>
  abstract findByEmailAndPassword(email: string): Promise<User | null>
  abstract findById(id: number): Promise<User | null>
  abstract create(input: CreateUserInput): Promise<User>
  abstract update(id: number, input: UpdateUserInput): Promise<User>
  abstract delete(id: number): Promise<void>
  abstract findAll(): Promise<User[]>
}
