import { Injectable, BadRequestException, Logger } from '@nestjs/common'
import { UserRepositoryPort } from '../../../users/domain/repositories/user.repository.port'

@Injectable()
export class GetProfileUseCase {
  private readonly logger = new Logger(GetProfileUseCase.name)

  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(userId: number) {
    this.logger.log('Buscando perfil do usuário', { userId })
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
