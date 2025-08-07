import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, Min } from 'class-validator'

export class CreatePartDto {
  @ApiProperty({
    description: 'Nome da peça',
    example: 'Filtro de óleo',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Descrição da peça (opcional)',
    example: 'Filtro de óleo para motor 1.0',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 10,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number

  @ApiProperty({
    description: 'Preço unitário da peça',
    example: 25.5,
  })
  @IsNumber()
  @Min(0)
  unitPrice: number
}
