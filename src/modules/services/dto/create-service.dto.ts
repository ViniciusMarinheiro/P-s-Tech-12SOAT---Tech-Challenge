import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, Min } from 'class-validator'

export class CreateServiceDto {
  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Troca de óleo',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Descrição do serviço (opcional)',
    example: 'Troca de óleo do motor com filtro',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Preço do serviço em centavos',
    example: 5000, // R$ 50,00
  })
  @IsNumber()
  @Min(0)
  price: number
}
