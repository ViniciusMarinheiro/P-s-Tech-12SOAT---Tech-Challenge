import { Injectable, Logger } from '@nestjs/common'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { CreateUserInput } from '../../domain/interfaces/create-user.input.interface'
import { User } from '../../domain/entities/user.entity'

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name)

  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(createUserDto: CreateUserInput): Promise<User> {
    this.logger.log('Criando usuário', createUserDto)
    const user = await this.userRepository.create(createUserDto)
    this.logger.log('Usuário criado com sucesso')
    return user
  }
}
