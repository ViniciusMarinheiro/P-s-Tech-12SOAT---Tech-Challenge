import { CustomerResponseDto } from '@/modules/customers/infrastructure/web/dto/customer-response.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class VehicleResponseDto {
  @ApiProperty({
    description: 'ID único do veículo',
    example: 1,
  })
  @IsString()
  id: number

  @ApiProperty({
    description: 'ID do cliente',
    example: 1,
  })
  @IsNumber()
  customerId: number

  @ApiProperty({ description: 'Cliente' })
  @IsNumber()
  customer: CustomerResponseDto

  @ApiProperty({ description: 'Placa do veículo' })
  @IsString()
  plate: string

  @ApiProperty({ description: 'Marca do veículo' })
  @IsString()
  brand: string

  @ApiProperty({ description: 'Modelo do veículo' })
  @IsString()
  model: string

  @ApiProperty({ description: 'Ano do veículo' })
  @IsNumber()
  year: number

  @ApiProperty({
    description: 'Data de criação do veículo',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Data de última atualização do veículo',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date
}
