import { IsString, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateVehiclesDto {
  @ApiProperty({ description: 'ID do cliente' })
  @IsNumber()
  customerId: number

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
}
