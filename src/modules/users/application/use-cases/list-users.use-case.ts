import { Injectable, Logger } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { User } from '../../domain/entities/user.entity'

@Injectable()
export class ListUsersUseCase {
  private readonly logger = new Logger(ListUsersUseCase.name)

  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(): Promise<User[]> {
    this.logger.log('Listando usuários')
    const users = await this.userRepository.findAll()
    this.logger.log('Usuários listados com sucesso', { count: users.length })
    return users
  }
}
