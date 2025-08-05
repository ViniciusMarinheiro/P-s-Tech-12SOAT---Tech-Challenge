import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from '../../common/strategies/jwt.strategy'
import { LocalStrategy } from '../../common/strategies/local.strategy'
import { User } from '../users/entities/user.entity'
import { UserRepository } from '../users/repositories/user.repository'
import { UserRepositoryPort } from '../users/repositories/port/user.repository.port'
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
    AuthService,
    JwtStrategy,
    LocalStrategy,
    {
      provide: UserRepositoryPort,
      useClass: UserRepository,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
