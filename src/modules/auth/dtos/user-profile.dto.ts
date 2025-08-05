import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../enums/user-role.enum'

export class UserProfileDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
  })
  name: string

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com',
  })
  email: string

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  role: UserRole

  @ApiProperty({
    description: 'Data de criação da conta',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date
}
