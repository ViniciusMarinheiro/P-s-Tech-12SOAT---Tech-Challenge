import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: number): Promise<void> {
    const existing = await this.userRepository.findById(id)
    if (!existing) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }
    return this.userRepository.delete(id)
  }
}
