import { CustomerResponseDto } from '@/modules/customers/dto/customer-response.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class VehiclesResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  @IsString()
  id: number

  @ApiProperty({ description: 'ID do cliente' })
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
    description: 'Data de criação do cliente',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Data de última atualização do cliente',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date
}
