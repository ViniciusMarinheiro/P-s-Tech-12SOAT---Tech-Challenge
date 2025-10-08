import { Injectable } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { User } from '../../domain/entities/user.entity'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }
    return user
  }
}
