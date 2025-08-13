import { Injectable, NotFoundException } from '@nestjs/common'
import { UserRepositoryPort } from './repositories/port/user.repository.port'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { CustomException } from '@/common/exceptions/customException'

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    return await this.userRepository.findByEmail(email)
  }

  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }
    return user
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.userRepository.create(createUserDto)
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    await this.findById(id)
    return await this.userRepository.update(id, updateUserDto)
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }
    return this.userRepository.delete(id)
  }

  async findAll(): Promise<UserResponseDto[]> {
    return await this.userRepository.findAll()
  }
}
