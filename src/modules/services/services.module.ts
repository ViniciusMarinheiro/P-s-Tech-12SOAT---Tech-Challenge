import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServicesController } from './services.controller'
import { ServicesService } from './services.service'
import { ServiceRepository } from './repositories/service.repository'
import { ServiceRepositoryPort } from './repositories/port/service.repository.port'
import { Service } from './entities/service.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    {
      provide: ServiceRepositoryPort,
      useClass: ServiceRepository,
    },
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
