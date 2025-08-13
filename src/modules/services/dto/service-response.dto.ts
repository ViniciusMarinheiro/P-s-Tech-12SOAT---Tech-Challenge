import { ApiProperty } from '@nestjs/swagger'

export class ServiceResponseDto {
  @ApiProperty({
    description: 'ID único do serviço',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nome do serviço',
    example: 'Troca de óleo',
  })
  name: string

  @ApiProperty({
    description: 'Descrição do serviço',
    example: 'Troca de óleo do motor com filtro',
    nullable: true,
  })
  description: string | null

  @ApiProperty({
    description: 'Preço do serviço em centavos',
    example: 5000, // R$ 50,00
  })
  price: number

  @ApiProperty({
    description: 'Data de criação do serviço',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date
}
