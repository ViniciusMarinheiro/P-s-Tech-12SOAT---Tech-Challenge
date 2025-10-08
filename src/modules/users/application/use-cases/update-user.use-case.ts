import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { UpdateUserInput } from '../../domain/interfaces/update-user.input.interface'
import { User } from '../../domain/entities/user.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: number, updateUserDto: UpdateUserInput): Promise<User> {
    const existing = await this.userRepository.findById(id)
    if (!existing) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }
    return this.userRepository.update(id, updateUserDto)
  }
}
