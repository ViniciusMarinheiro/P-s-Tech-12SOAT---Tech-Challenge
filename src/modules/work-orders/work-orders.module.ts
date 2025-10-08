import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WorkOrdersController } from './infrastructure/web/work-orders.controller'
import { WorkOrderRepository } from './infrastructure/database/work-order.repository'
import { WorkOrderRepositoryPort } from './domain/repositories/work-order.repository.port'
import { WorkOrder } from '@/modules/work-orders/infrastructure/database/work-order.entity'
import { WorkOrderService } from '@/modules/work-orders/infrastructure/database/work-order-service.entity'
import { WorkOrderPart } from '@/modules/work-orders/infrastructure/database/work-order-part.entity'
import { VehiclesModule } from '../vehicles/vehicles.module'
import { CustomersModule } from '../customers/customers.module'
import { ServicesModule } from '../services/services.module'
import { PartsModule } from '../parts/parts.module'
import { EmailProviderModule } from '@/providers/email/email.provider.module'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { CreateWorkOrderUseCase } from './application/use-cases/create-work-order.use-case'
import { FindAllWorkOrdersUseCase } from './application/use-cases/find-all-work-orders.use-case'
import { FindWorkOrderByIdUseCase } from './application/use-cases/find-work-order-by-id.use-case'
import { FindWorkOrdersByCustomerDocumentUseCase } from './application/use-cases/find-work-orders-by-customer-document.use-case'
import { GetWorkOrderProgressUseCase } from './application/use-cases/get-work-order-progress.use-case'
import { UpdateWorkOrderUseCase } from './application/use-cases/update-work-order.use-case'
import { UpdateWorkOrderStatusUseCase } from './application/use-cases/update-work-order-status.use-case'
import { FindWorkOrderByHashViewUseCase } from './application/use-cases/find-work-orders-by-hash-view.use-case'
import { ApproveHashViewUseCase } from './application/use-cases/approve-hash-view.use-case'

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
    EnvConfigService,
    {
      provide: WorkOrderRepositoryPort,
      useClass: WorkOrderRepository,
    },
    CreateWorkOrderUseCase,
    FindAllWorkOrdersUseCase,
    FindWorkOrderByIdUseCase,
    FindWorkOrdersByCustomerDocumentUseCase,
    GetWorkOrderProgressUseCase,
    UpdateWorkOrderUseCase,
    UpdateWorkOrderStatusUseCase,
    FindWorkOrderByHashViewUseCase,
    ApproveHashViewUseCase,
  ],
  exports: [
    CreateWorkOrderUseCase,
    FindAllWorkOrdersUseCase,
    FindWorkOrderByIdUseCase,
    FindWorkOrdersByCustomerDocumentUseCase,
    GetWorkOrderProgressUseCase,
    UpdateWorkOrderUseCase,
    UpdateWorkOrderStatusUseCase,
    FindWorkOrderByHashViewUseCase,
    ApproveHashViewUseCase,
  ],
})
export class WorkOrdersModule {}
