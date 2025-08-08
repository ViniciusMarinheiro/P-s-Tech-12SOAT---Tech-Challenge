import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator'
import { Type } from 'class-transformer'
import { WorkOrderStatusEnum } from '../enum/work-order-status.enum'

export class WorkOrderServiceDto {
  @ApiProperty({
    description: 'ID do serviço',
    example: 1,
  })
  @IsNumber()
  serviceId: number

  @ApiProperty({
    description: 'Quantidade do serviço',
    example: 1,
    default: 1,
  })
  @IsNumber()
  quantity: number = 1

  @IsOptional()
  @IsNumber()
  price?: number
}

export class WorkOrderPartDto {
  @ApiProperty({
    description: 'ID da peça',
    example: 1,
  })
  @IsNumber()
  partId: number

  @ApiProperty({
    description: 'Quantidade da peça',
    example: 2,
    default: 1,
  })
  @IsNumber()
  quantity: number = 1

  @IsOptional()
  @IsNumber()
  price?: number
}

export class CreateWorkOrderDto {
  @ApiProperty({
    description: 'ID do cliente',
    example: 1,
  })
  @IsNumber()
  customerId: number

  @ApiProperty({
    description: 'ID do veículo',
    example: 1,
  })
  @IsNumber()
  vehicleId: number

  @IsOptional()
  @IsNumber()
  userId?: number

  @ApiProperty({
    description: 'Lista de serviços da ordem',
    type: [WorkOrderServiceDto],
    example: [
      { serviceId: 1, quantity: 1 },
      { serviceId: 2, quantity: 1 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkOrderServiceDto)
  services?: WorkOrderServiceDto[]

  @ApiProperty({
    description: 'Lista de peças da ordem',
    type: [WorkOrderPartDto],
    example: [
      { partId: 1, quantity: 2 },
      { partId: 3, quantity: 1 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkOrderPartDto)
  parts?: WorkOrderPartDto[]
}
