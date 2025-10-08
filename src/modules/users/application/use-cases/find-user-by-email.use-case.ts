import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { User } from '../../domain/entities/user.entity'

@Injectable()
export class FindUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email)
  }
}
