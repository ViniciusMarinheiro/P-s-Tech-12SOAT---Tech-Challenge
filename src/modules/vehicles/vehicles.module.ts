import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VehiclesController } from './vehicles.controller'
import { VehiclesService } from './vehicles.service'
import { VehiclesRepository } from './repositories/vehicles.repository'
import { VehiclesRepositoryPort } from './repositories/port/vehicles.repository.port'
import { Vehicle } from './entities/vehicle.entity'
import { CustomersModule } from '../customers/customers.module'

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), CustomersModule],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    {
      provide: VehiclesRepositoryPort,
      useClass: VehiclesRepository,
    },
  ],
  exports: [VehiclesService],
})
export class VehiclesModule {}
