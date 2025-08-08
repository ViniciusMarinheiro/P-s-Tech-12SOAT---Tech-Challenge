import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { WorkOrderStatusEnum } from '../enum/work-order-status.enum'

export class UpdateWorkOrderStatusDto {
  @ApiProperty({
    description: 'Novo status da ordem de serviço',
    enum: WorkOrderStatusEnum,
    example: WorkOrderStatusEnum.IN_PROGRESS,
  })
  @IsEnum(WorkOrderStatusEnum)
  status: WorkOrderStatusEnum
}
