import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '../enums/user-role.enum'

export class AuthUserDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nome do usuário',
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
    example: UserRole.ATTENDANT,
  })
  role: UserRole
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  id: number

  @ApiProperty({
    description: 'Nome do usuário',
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
    example: UserRole.ATTENDANT,
  })
  role: UserRole

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Data de última atualização do usuário',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date
}
