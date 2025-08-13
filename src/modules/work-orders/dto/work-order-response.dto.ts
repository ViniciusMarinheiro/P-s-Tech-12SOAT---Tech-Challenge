import { ApiProperty } from '@nestjs/swagger'
import { WorkOrderStatusEnum } from '../enum/work-order-status.enum'

export class WorkOrderServiceResponseDto {
  @ApiProperty({
    description: 'ID do serviço na ordem',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'ID do serviço',
    example: 1,
  })
  serviceId: number

  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Troca de óleo',
  })
  serviceName: string

  @ApiProperty({
    description: 'Quantidade do serviço',
    example: 1,
  })
  quantity: number

  @ApiProperty({
    description: 'Preço unitário do serviço (em centavos)',
    example: 5000,
  })
  unitPrice: number

  @ApiProperty({
    description: 'Preço total do serviço (em centavos)',
    example: 5000,
  })
  totalPrice: number
}

export class WorkOrderPartResponseDto {
  @ApiProperty({
    description: 'ID da peça na ordem',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'ID da peça',
    example: 1,
  })
  partId: number

  @ApiProperty({
    description: 'Nome da peça',
    example: 'Óleo de motor 5W30',
  })
  partName: string

  @ApiProperty({
    description: 'Quantidade da peça',
    example: 2,
  })
  quantity: number

  @ApiProperty({
    description: 'Preço unitário da peça (em centavos)',
    example: 2500,
  })
  unitPrice: number

  @ApiProperty({
    description: 'Preço total da peça (em centavos)',
    example: 5000,
  })
  totalPrice: number
}

class CustomerResponseDto {
  @ApiProperty({
    description: 'ID do cliente',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva Santos',
  })
  name: string

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao@gmail.com',
  })
  email: string
}

class VehicleResponseDto {
  @ApiProperty({
    description: 'ID do veículo',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Placa do veículo',
    example: 'ABC-1234',
  })
  plate: string
}

class UserResponseDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  name: string

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@gmail.com',
  })
  email: string
}

export class WorkOrderResponseDto {
  @ApiProperty({
    description: 'ID da ordem de serviço',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'ID do cliente',
    example: 1,
  })
  customerId: number

  @ApiProperty({
    description: 'Cliente',
    type: CustomerResponseDto,
  })
  customer: CustomerResponseDto

  @ApiProperty({
    description: 'ID do usuário',
    type: UserResponseDto,
  })
  user: UserResponseDto

  @ApiProperty({
    description: 'Veículo',
    type: VehicleResponseDto,
  })
  vehicle: VehicleResponseDto

  @ApiProperty({
    description: 'ID do veículo',
    example: 1,
  })
  vehicleId: number

  @ApiProperty({
    description: 'Hash de visualização da ordem de serviço',
    example: '1234567890',
  })
  hashView: string

  @ApiProperty({
    description: 'Status da ordem de serviço',
    enum: WorkOrderStatusEnum,
    example: WorkOrderStatusEnum.IN_PROGRESS,
  })
  status: WorkOrderStatusEnum

  @ApiProperty({
    description: 'Valor total da ordem (em centavos)',
    example: 15000,
  })
  totalAmount: number

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Data de início',
    example: '2024-01-15T10:30:00Z',
  })
  startedAt: Date

  @ApiProperty({
    description: 'Data de conclusão',
    example: '2024-01-15T10:30:00Z',
  })
  finishedAt?: Date

  @ApiProperty({
    description: 'Tempo de conclusão em minutos',
    example: 150,
  })
  timeToFinish?: number

  @ApiProperty({
    description: 'Tempo de conclusão',
    example: '2h 30m',
  })
  timeToFinishText?: string

  @ApiProperty({
    description: 'Data de última atualização',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Lista de serviços da ordem',
    type: [WorkOrderServiceResponseDto],
  })
  services: WorkOrderServiceResponseDto[]

  @ApiProperty({
    description: 'Lista de peças da ordem',
    type: [WorkOrderPartResponseDto],
  })
  parts: WorkOrderPartResponseDto[]
}
