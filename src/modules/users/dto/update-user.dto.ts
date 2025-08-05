import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { UserRole } from '../../auth/enums/user-role.enum'

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name?: string

  @ApiProperty({
    description: 'Email único do usuário',
    example: 'joao.silva@example.com',
    format: 'email',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string

  @ApiProperty({
    description: 'Senha do usuário (hash)',
    example: '$2b$10$...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Password deve ser uma string' })
  password?: string

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.CUSTOMER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role deve ser um valor válido' })
  role?: UserRole
}
