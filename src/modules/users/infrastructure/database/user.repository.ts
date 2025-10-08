import { Injectable, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User as OrmUser } from './user.entity'
import { UpdateUserInput } from '../../domain/interfaces/update-user.input.interface'
import { CreateUserInput } from '../../domain/interfaces/create-user.input.interface'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { UserRepositoryPort } from '../../domain/repositories/user.repository.port'
import { User as DomainUser } from '../../domain/entities/user.entity'
import { UserMapper } from '../mappers/user.mapper'

@Injectable()
export class UserRepository extends UserRepositoryPort {
  constructor(
    @InjectRepository(OrmUser)
    private readonly repository: Repository<OrmUser>,
  ) {
    super()
  }

  async findByEmail(email: string): Promise<DomainUser | null> {
    const user = await this.repository.findOne({ where: { email } })
    if (!user) return null
    return UserMapper.toDomain(user)
  }

  async findByEmailAndPassword(email: string): Promise<DomainUser | null> {
    const user = await this.repository.findOne({ where: { email } })
    if (!user) return null
    return UserMapper.toDomain(user)
  }

  async findById(id: number): Promise<DomainUser | null> {
    const user = await this.repository.findOne({ where: { id } })
    if (!user) return null
    return UserMapper.toDomain(user)
  }

  async create(createUserDto: CreateUserInput): Promise<DomainUser> {
    const user = this.repository.create(createUserDto as unknown as OrmUser)
    const savedUser = (await this.repository.save(
      user as unknown as OrmUser,
    )) as OrmUser
    return UserMapper.toDomain(savedUser)
  }

  async update(
    id: number,
    updateUserDto: UpdateUserInput,
  ): Promise<DomainUser> {
    await this.repository.update(id, updateUserDto)
    const updatedUser = await this.repository.findOne({ where: { id } })

    if (!updatedUser) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }
    return UserMapper.toDomain(updatedUser)
  }

  async delete(id: number): Promise<void> {
    const user = await this.repository.findOne({ where: { id } })

    if (!user) {
      throw new CustomException(ErrorMessages.USER.NOT_FOUND(id))
    }

    await this.repository.remove(user)
  }

  async findAll(): Promise<DomainUser[]> {
    const users = await this.repository.find()
    return users.map((user) => UserMapper.toDomain(user))
  }
}
