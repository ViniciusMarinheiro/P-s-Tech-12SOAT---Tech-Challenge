import { ApiProperty } from '@nestjs/swagger'
import {
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'
import { WorkOrderStatusEnum } from '../enum/work-order-status.enum'

class UpdateWorkOrderServiceDto {
  @ApiProperty({
    description: 'ID do serviço',
    example: 1,
  })
  @IsInt()
  @Min(1)
  serviceId: number

  @ApiProperty({
    description: 'Quantidade do serviço',
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number
}

class UpdateWorkOrderPartDto {
  @ApiProperty({
    description: 'ID da peça',
    example: 1,
  })
  @IsInt()
  @Min(1)
  partId: number

  @ApiProperty({
    description: 'Quantidade da peça',
    example: 3,
  })
  @IsInt()
  @Min(1)
  quantity: number
}

export class UpdateWorkOrderDto {
  @ApiProperty({
    description: 'Lista de serviços da ordem',
    type: [UpdateWorkOrderServiceDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateWorkOrderServiceDto)
  services?: UpdateWorkOrderServiceDto[]

  @ApiProperty({
    description: 'Lista de peças da ordem',
    type: [UpdateWorkOrderPartDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateWorkOrderPartDto)
  parts?: UpdateWorkOrderPartDto[]
}
