import { Injectable, Logger } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { User } from '../../domain/entities/user.entity'

@Injectable()
export class FindUserByEmailUseCase {
  private readonly logger = new Logger(FindUserByEmailUseCase.name)

  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(email: string): Promise<User | null> {
    this.logger.log('Buscando usuário por email', { email })
    return this.userRepository.findByEmail(email)
  }
}
