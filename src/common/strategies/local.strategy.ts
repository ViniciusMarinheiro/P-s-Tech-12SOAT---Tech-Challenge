import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { ValidateUserUseCase } from '../../modules/auth/application/use-cases/validate-user.use-case'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private validateUserUseCase: ValidateUserUseCase) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.validateUserUseCase.execute(email, password)
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas')
    }
    return user
  }
}
