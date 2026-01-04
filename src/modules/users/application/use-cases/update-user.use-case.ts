import { Injectable, Logger } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { UpdateUserInput } from '../../domain/interfaces/update-user.input.interface'
import { User } from '../../domain/entities/user.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UpdateUserUseCase.name)

  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: number, updateUserDto: UpdateUserInput): Promise<User> {
    this.logger.log('Atualizando usuário', { id, ...updateUserDto })
    const existing = await this.userRepository.findById(id)
    if (!existing) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }
    const user = await this.userRepository.update(id, updateUserDto)
    this.logger.log('Usuário atualizado com sucesso')
    return user
  }
}
