import { Injectable, Logger } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { User } from '../../domain/entities/user.entity'

@Injectable()
export class FindUserByEmailAndPasswordUseCase {
  private readonly logger = new Logger(FindUserByEmailAndPasswordUseCase.name)

  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(email: string): Promise<User | null> {
    this.logger.log('Buscando usuário por email e senha', { email })
    return this.userRepository.findByEmailAndPassword(email)
  }
}
