import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
  AuthUser,
  JwtPayload,
} from '../../domain/interfaces/auth-response.interface'

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name)

  constructor(private readonly jwtService: JwtService) {}

  async execute(user: AuthUser): Promise<{ access_token: string }> {
    this.logger.log('Realizando login', { userId: user.id, email: user.email })
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }
    const access_token = this.jwtService.sign(payload)
    this.logger.log('Login realizado com sucesso')
    return { access_token }
  }
}
