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
import { UserResponsePasswordDto } from '../dto/user-response-password.dto'

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
    if (!user) return null

    const dto = new UserResponseDto()
    dto.id = user.id
    dto.name = user.name
    dto.email = user.email
    dto.role = user.role
    dto.createdAt = user.createdAt
    dto.updatedAt = user.updatedAt
    return dto
  }

  async findByEmailAndPassword(
    email: string,
  ): Promise<UserResponsePasswordDto | null> {
    const user = await this.repository.findOne({ where: { email } })
    if (!user) return null

    const dto = new UserResponsePasswordDto()
    dto.id = user.id
    dto.name = user.name
    dto.email = user.email
    dto.password = user.password
    dto.role = user.role
    dto.createdAt = user.createdAt
    dto.updatedAt = user.updatedAt
    return dto
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.repository.findOne({ where: { id } })
    if (!user) return null

    const dto = new UserResponseDto()
    dto.id = user.id
    dto.name = user.name
    dto.email = user.email
    dto.role = user.role
    dto.createdAt = user.createdAt
    dto.updatedAt = user.updatedAt
    return dto
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = this.repository.create(createUserDto)
    const savedUser = await this.repository.save(user)

    const dto = new UserResponseDto()
    dto.id = savedUser.id
    dto.name = savedUser.name
    dto.email = savedUser.email
    dto.role = savedUser.role
    dto.createdAt = savedUser.createdAt
    dto.updatedAt = savedUser.updatedAt
    return dto
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

    const dto = new UserResponseDto()
    dto.id = updatedUser.id
    dto.name = updatedUser.name
    dto.email = updatedUser.email
    dto.role = updatedUser.role
    dto.createdAt = updatedUser.createdAt
    dto.updatedAt = updatedUser.updatedAt
    return dto
  }

  async delete(id: number): Promise<void> {
    const user = await this.repository.findOne({ where: { id } })

    if (!user) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }

    await this.repository.remove(user)
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.find()
    return users.map((user) => {
      const dto = new UserResponseDto()
      dto.id = user.id
      dto.name = user.name
      dto.email = user.email
      dto.role = user.role
      dto.createdAt = user.createdAt
      dto.updatedAt = user.updatedAt
      return dto
    })
  }
}
