import { Injectable, Logger } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class DeleteUserUseCase {
  private readonly logger = new Logger(DeleteUserUseCase.name)

  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: number): Promise<void> {
    this.logger.log('Deletando usuário', { id })
    const existing = await this.userRepository.findById(id)
    if (!existing) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }
    await this.userRepository.delete(id)
    this.logger.log('Usuário deletado com sucesso')
  }
}
