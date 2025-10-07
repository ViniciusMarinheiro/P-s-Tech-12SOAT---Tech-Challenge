import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { VehiclesRepository } from './infrastructure/database/vehicles.repository'
import { VehiclesRepositoryPort } from './domain/repositories/vehicles.repository.port'
import { CreateVehicleUseCase } from './application/use-cases/create-vehicle.use-case'
import { FindVehicleByIdUseCase } from './application/use-cases/find-vehicle-by-id.use-case'
import { FindVehicleByPlateUseCase } from './application/use-cases/find-vehicle-by-plate.use-case'
import { UpdateVehicleUseCase } from './application/use-cases/update-vehicle.use-case'
import { ListVehiclesUseCase } from './application/use-cases/list-vehicles.use-case'
import { Vehicle } from './infrastructure/database/vehicle.entity'
import { CustomersModule } from '../customers/customers.module'
import { VehiclesController } from './web/vehicles.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle]), CustomersModule],
  controllers: [VehiclesController],
  providers: [
    {
      provide: VehiclesRepositoryPort,
      useClass: VehiclesRepository,
    },
    CreateVehicleUseCase,
    FindVehicleByIdUseCase,
    FindVehicleByPlateUseCase,
    UpdateVehicleUseCase,
    ListVehiclesUseCase,
  ],
  exports: [
    CreateVehicleUseCase,
    FindVehicleByIdUseCase,
    FindVehicleByPlateUseCase,
    UpdateVehicleUseCase,
    ListVehiclesUseCase,
  ],
})
export class VehiclesModule {}
