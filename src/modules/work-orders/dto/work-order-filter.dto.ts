import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { WorkOrderStatusEnum } from '../enum/work-order-status.enum'

export class WorkOrderFilterDto {
  @ApiPropertyOptional({
    description: 'Id da ordem de serviço',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number

  @ApiPropertyOptional({
    description: 'Status',
    enum: WorkOrderStatusEnum,
  })
  @IsOptional()
  @IsEnum(WorkOrderStatusEnum)
  status: WorkOrderStatusEnum

  @ApiPropertyOptional({
    description: 'Id do cliente',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerId?: number

  @ApiPropertyOptional({
    description: 'Id do veículo',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vehicleId?: number

  @ApiPropertyOptional({
    description: 'CPF/CNPJ do cliente',
  })
  @IsOptional()
  @IsString()
  customerDocument?: string
}
