import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
  AuthUser,
  JwtPayload,
} from '../../domain/interfaces/auth-response.interface'

@Injectable()
export class LoginUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(user: AuthUser): Promise<{ access_token: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }
    return { access_token: this.jwtService.sign(payload) }
  }
}
