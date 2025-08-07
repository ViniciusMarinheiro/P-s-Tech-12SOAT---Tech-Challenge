import { ApiProperty } from '@nestjs/swagger'

export class PartResponseDto {
  @ApiProperty({
    description: 'ID único da peça',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nome da peça',
    example: 'Filtro de óleo',
  })
  name: string

  @ApiProperty({
    description: 'Descrição da peça',
    example: 'Filtro de óleo para motor 1.0',
    nullable: true,
  })
  description: string | null

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 10,
  })
  stock: number

  @ApiProperty({
    description: 'Preço unitário da peça',
    example: 25.5,
  })
  unitPrice: number

  @ApiProperty({
    description: 'Data de criação da peça',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date
}
