import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PartsController } from './web/parts.controller'
import { Part } from './infrastructure/database/part.entity'
import { PartRepository } from './infrastructure/database/part.repository'
import { PartRepositoryPort } from './domain/repositories/part.repository.port'
import { CreatePartUseCase } from './application/use-cases/create-part.use-case'
import { FindPartByIdUseCase } from './application/use-cases/find-part-by-id.use-case'
import { ListPartsUseCase } from './application/use-cases/list-parts.use-case'
import { UpdatePartUseCase } from './application/use-cases/update-part.use-case'
import { UpdatePartStockUseCase } from './application/use-cases/update-part-stock.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([Part])],
  controllers: [PartsController],
  providers: [
    {
      provide: PartRepositoryPort,
      useClass: PartRepository,
    },
    CreatePartUseCase,
    FindPartByIdUseCase,
    ListPartsUseCase,
    UpdatePartUseCase,
    UpdatePartStockUseCase,
  ],
  exports: [
    CreatePartUseCase,
    FindPartByIdUseCase,
    ListPartsUseCase,
    UpdatePartUseCase,
    UpdatePartStockUseCase,
  ],
})
export class PartsModule {}
