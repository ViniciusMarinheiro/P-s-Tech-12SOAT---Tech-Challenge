import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { UserRepositoryPort } from './port/user.repository.port'
import { UpdateUserDto } from '../dto/update-user.dto'
import { CreateUserDto } from '../dto/create-user.dto'

@Injectable()
export class UserRepository extends UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    super()
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } })
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } })
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.repository.create(createUserDto)
    return this.repository.save(user)
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.repository.update(id, updateUserDto)
    const updatedUser = await this.findById(id)
    if (!updatedUser) {
      throw new Error('Usuário não encontrado após atualização')
    }
    return updatedUser
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id)
    if (!user) {
      throw new Error(`User with ID ${id} not found`)
    }
    await this.repository.remove(user)
  }

  async findAll(): Promise<User[]> {
    return this.repository.find()
  }
}
