import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Customer } from '@/modules/customers/entities/customer.entity'
import { Vehicle } from '@/modules/vehicles/entities/vehicle.entity'
import { Service } from '@/modules/services/entities/service.entity'
import { Part } from '@/modules/parts/entities/part.entity'
import { WorkOrder } from '@/modules/work-orders/entities/work-order.entity'
import { WorkOrderService } from '@/modules/work-orders/entities/work-order-service.entity'
import { WorkOrderPart } from '@/modules/work-orders/entities/work-order-part.entity'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { User } from '@/modules/users/entities/user.entity'

export const databaseConfig = (
  envConfigService: EnvConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: envConfigService.get('DB_HOST'),
  port: parseInt(envConfigService.get('DB_PORT')),
  username: envConfigService.get('DB_USERNAME'),
  password: envConfigService.get('DB_PASSWORD'),
  database: envConfigService.get('DB_DATABASE'),
  schema: envConfigService.get('DB_SCHEMA'),
  entities: [
    Customer,
    Vehicle,
    Service,
    Part,
    WorkOrder,
    WorkOrderService,
    WorkOrderPart,
    User,
  ],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
  logging: envConfigService.get('NODE_ENV') !== 'production',
})
