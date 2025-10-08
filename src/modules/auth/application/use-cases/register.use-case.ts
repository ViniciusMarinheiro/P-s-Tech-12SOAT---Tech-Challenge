import { Injectable, BadRequestException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { UserRole } from '../../domain/enums/user-role.enum'
import { RegisterDto } from '../../infrastructure/web/dto/register.dto'
import { UserRepositoryPort } from '../../../users/domain/repositories/user.repository.port'

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    )
    if (existingUser) {
      throw new BadRequestException('Email já está em uso')
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    const savedUser = await this.userRepository.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: UserRole.ATTENDANT,
    })
    return savedUser
  }
}
