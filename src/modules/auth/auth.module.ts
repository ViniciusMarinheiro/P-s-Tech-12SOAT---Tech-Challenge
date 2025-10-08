import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case'
import { LoginUseCase } from './application/use-cases/login.use-case'
import { RegisterUseCase } from './application/use-cases/register.use-case'
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case'
import { AuthController } from './infrastructure/web/auth.controller'
import { JwtStrategy } from '../../common/strategies/jwt.strategy'
import { LocalStrategy } from '../../common/strategies/local.strategy'
import { User } from '../users/infrastructure/database/user.entity'
import { UserRepository } from '../users/infrastructure/database/user.repository'
import { UserRepositoryPort } from '../users/domain/repositories/user.repository.port'
import { EnvConfigModule } from '../../common/service/env/env-config.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    EnvConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    ValidateUserUseCase,
    LoginUseCase,
    RegisterUseCase,
    GetProfileUseCase,
    JwtStrategy,
    LocalStrategy,
    {
      provide: UserRepositoryPort,
      useClass: UserRepository,
    },
  ],
  controllers: [AuthController],
  exports: [
    ValidateUserUseCase,
    LoginUseCase,
    RegisterUseCase,
    GetProfileUseCase,
  ],
})
export class AuthModule {}
