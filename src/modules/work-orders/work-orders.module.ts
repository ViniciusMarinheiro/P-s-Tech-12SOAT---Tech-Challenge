import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WorkOrdersController } from './work-orders.controller'
import { WorkOrdersService } from './work-orders.service'
import { WorkOrderRepository } from './repositories/work-order.repository'
import { WorkOrderRepositoryPort } from './repositories/port/work-order.repository.port'
import { WorkOrder } from './entities/work-order.entity'
import { WorkOrderService } from './entities/work-order-service.entity'
import { WorkOrderPart } from './entities/work-order-part.entity'
import { VehiclesModule } from '../vehicles/vehicles.module'
import { CustomersModule } from '../customers/customers.module'
import { ServicesModule } from '../services/services.module'
import { PartsModule } from '../parts/parts.module'
import { EmailProviderModule } from '@/providers/email/email.provider.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkOrder, WorkOrderService, WorkOrderPart]),
    VehiclesModule,
    CustomersModule,
    ServicesModule,
    PartsModule,
    EmailProviderModule,
  ],
  controllers: [WorkOrdersController],
  providers: [
    WorkOrdersService,
    {
      provide: WorkOrderRepositoryPort,
      useClass: WorkOrderRepository,
    },
  ],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
