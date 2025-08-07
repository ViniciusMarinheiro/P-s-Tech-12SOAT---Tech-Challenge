import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CustomerResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  @IsString()
  id: number

  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'João Silva Santos',
  })
  @IsString()
  name: string

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao.silva@example.com',
  })
  @IsString()
  email: string

  @ApiProperty({ description: 'Número do documento' })
  @IsString()
  documentNumber: string

  @ApiProperty({ description: 'Telefone do cliente' })
  @IsOptional()
  phone?: string

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
