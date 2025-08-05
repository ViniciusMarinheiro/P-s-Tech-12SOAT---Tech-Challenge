import { DataSource } from 'typeorm'
import { Customer } from '../../modules/customers/entities/customer.entity'
import { Vehicle } from '../../modules/vehicles/vehicle.entity'
import { Service } from '../../modules/services/service.entity'
import { Part } from '../../modules/parts/part.entity'
import { WorkOrder } from '../../modules/work-orders/work-order.entity'
import { WorkOrderService } from '../../modules/work-orders/work-order-service.entity'
import { WorkOrderPart } from '../../modules/work-orders/work-order-part.entity'
import { config } from 'dotenv'
import { User } from '../../modules/users/entities/user.entity'

config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  schema: process.env.DB_SCHEMA || 'public',
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
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
})
