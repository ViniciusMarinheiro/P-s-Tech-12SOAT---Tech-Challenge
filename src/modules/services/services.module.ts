import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServicesController } from './infrastructure/web/services.controller'
import { Service } from './infrastructure/database/service.entity'
import { ServiceRepository } from './infrastructure/database/service.repository'
import { ServiceRepositoryPort } from './domain/repositories/service.repository.port'
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case'
import { FindServiceByIdUseCase } from './application/use-cases/find-service-by-id.use-case'
import { ListServicesUseCase } from './application/use-cases/list-services.use-case'
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController],
  providers: [
    {
      provide: ServiceRepositoryPort,
      useClass: ServiceRepository,
    },
    CreateServiceUseCase,
    FindServiceByIdUseCase,
    ListServicesUseCase,
    UpdateServiceUseCase,
  ],
  exports: [
    CreateServiceUseCase,
    FindServiceByIdUseCase,
    ListServicesUseCase,
    UpdateServiceUseCase,
  ],
})
export class ServicesModule {}
