import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { CreateUserInput } from '../../domain/interfaces/create-user.input.interface'
import { User } from '../../domain/entities/user.entity'

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(createUserDto: CreateUserInput): Promise<User> {
    return this.userRepository.create(createUserDto)
  }
}
