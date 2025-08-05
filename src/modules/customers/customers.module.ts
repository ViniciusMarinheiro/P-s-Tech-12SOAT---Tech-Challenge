import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomersController } from './customers.controller'
import { Customer } from './entities/customer.entity'
import { CustomersService } from './customers.service'
import { CustomerRepository } from './repositories/customer.repository'
import { CustomerRepositoryPort } from './repositories/port/customer.repository.port'

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    {
      provide: CustomerRepositoryPort,
      useClass: CustomerRepository,
    },
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
