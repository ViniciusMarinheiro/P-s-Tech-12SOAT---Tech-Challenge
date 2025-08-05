import { Injectable, NotFoundException } from '@nestjs/common'
import { UserRepositoryPort } from './repositories/port/user.repository.port'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { UserMapper } from './mappers/user.mapper'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email)
    return user ? UserMapper.toDto(user) : null
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }
    return UserMapper.toDto(user)
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.create(createUserDto)
    return UserMapper.toDto(user)
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    // Verifica se existe antes de atualizar
    await this.findById(id)
    const updatedUser = await this.userRepository.update(id, updateUserDto)
    return UserMapper.toDto(updatedUser)
  }

  async delete(id: number): Promise<void> {
    // Verifica se existe antes de deletar
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }
    return this.userRepository.delete(id)
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll()
    return UserMapper.toDtoList(users)
  }
}
