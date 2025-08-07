import { Injectable, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UserRole } from './enums/user-role.enum'
import { RegisterDto } from './dtos/register.dto'
import {
  LoginResponse,
  RegisterResponse,
  JwtPayload,
  AuthUser,
} from './interfaces/auth-response.interface'
import { UserRepositoryPort } from '../users/repositories/port/user.repository.port'

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepositoryPort,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUser | null> {
    const user = await this.userRepository.findByEmailAndPassword(email)

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }
    return null
  }

  async login(user: AuthUser): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
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
      role: UserRole.CUSTOMER,
    })

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    }
  }

  async getProfile(userId: number): Promise<RegisterResponse> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new BadRequestException('Usuário não encontrado')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
