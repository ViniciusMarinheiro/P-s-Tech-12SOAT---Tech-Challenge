import { Injectable, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UserRepositoryPort } from './port/user.repository.port'
import { UpdateUserDto } from '../dto/update-user.dto'
import { CreateUserDto } from '../dto/create-user.dto'
import { UserResponseDto } from '../dto/user-response.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'

@Injectable()
export class UserRepository extends UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    super()
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.repository.findOne({ where: { email } })
    return user
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.repository.findOne({ where: { id } })
    return user
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.repository.create(createUserDto)
    const savedUser = await this.repository.save(user)
    return savedUser
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    await this.repository.update(id, updateUserDto)
    const updatedUser = await this.repository.findOne({ where: { id } })

    if (!updatedUser) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }

    return updatedUser
  }

  async delete(id: number): Promise<void> {
    const user = await this.repository.findOne({ where: { id } })

    if (!user) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }

    await this.repository.remove(user)
  }

  async findAll(): Promise<UserResponseDto[]> {
    return await this.repository.find()
  }
}
