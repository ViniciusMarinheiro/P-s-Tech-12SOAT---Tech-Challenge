import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { UserRepositoryPort } from '../../../users/domain/repositories/user.repository.port'
import { AuthUser } from '../../domain/interfaces/auth-response.interface'

@Injectable()
export class ValidateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.userRepository.findByEmailAndPassword(email)
    if (user?.password && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }
    return null
  }
}
