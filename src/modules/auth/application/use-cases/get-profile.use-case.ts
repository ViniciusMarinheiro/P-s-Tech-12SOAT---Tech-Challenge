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
    return user
  }
}
