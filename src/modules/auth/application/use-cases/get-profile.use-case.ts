import { Injectable, BadRequestException } from '@nestjs/common'
import { UserRepositoryPort } from '../../../users/domain/repositories/user.repository.port'

@Injectable()
export class GetProfileUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(userId: number) {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new BadRequestException('Usuário não encontrado')
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
