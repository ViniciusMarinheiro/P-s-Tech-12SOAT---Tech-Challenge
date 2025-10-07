import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { User } from '../../domain/entities/user.entity'

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll()
  }
}
