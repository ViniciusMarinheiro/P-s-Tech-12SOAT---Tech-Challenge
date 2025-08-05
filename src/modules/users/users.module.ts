import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserRepository } from './repositories/user.repository'
import { UsersService } from './users.service'
import { UserRepositoryPort } from './repositories/port/user.repository.port'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    {
      provide: UserRepositoryPort,
      useClass: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
