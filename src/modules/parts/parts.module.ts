import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PartsController } from './parts.controller'
import { PartsService } from './parts.service'
import { PartRepository } from './repositories/part.repository'
import { PartRepositoryPort } from './repositories/port/part.repository.port'
import { Part } from './entities/part.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Part])],
  controllers: [PartsController],
  providers: [
    PartsService,
    {
      provide: PartRepositoryPort,
      useClass: PartRepository,
    },
  ],
  exports: [PartsService],
})
export class PartsModule {}
