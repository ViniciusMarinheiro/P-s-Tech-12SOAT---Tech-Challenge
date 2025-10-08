import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomersController } from './infrastructure/web/customers.controller'
import { Customer } from './infrastructure/database/customer.entity'
import { CustomerRepository } from './infrastructure/database/customer.repository'
import { CustomerRepositoryPort } from './domain/repositories/customer.repository.port'
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case'
import { FindCustomerByIdUseCase } from './application/use-cases/find-customer-by-id.use-case'
import { FindCustomerByDocumentUseCase } from './application/use-cases/find-customer-by-document.use-case'
import { ListCustomersUseCase } from './application/use-cases/list-customers.use-case'
import { UpdateCustomerUseCase } from './application/use-cases/update-customer.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [
    {
      provide: CustomerRepositoryPort,
      useClass: CustomerRepository,
    },
    CreateCustomerUseCase,
    FindCustomerByIdUseCase,
    FindCustomerByDocumentUseCase,
    ListCustomersUseCase,
    UpdateCustomerUseCase,
  ],
  exports: [
    CreateCustomerUseCase,
    FindCustomerByIdUseCase,
    FindCustomerByDocumentUseCase,
    ListCustomersUseCase,
    UpdateCustomerUseCase,
  ],
})
export class CustomersModule {}
