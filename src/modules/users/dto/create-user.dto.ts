import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'
import { UserRole } from '../../auth/enums/user-role.enum'

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva Santos',
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string

  @ApiProperty({
    description: 'Email único do usuário',
    example: 'joao.silva@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string

  @ApiProperty({
    description: 'Senha do usuário (hash)',
    example: '$2b$10$...',
  })
  @IsString({ message: 'Password deve ser uma string' })
  @IsNotEmpty({ message: 'Password é obrigatório' })
  password: string

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  @IsEnum(UserRole, { message: 'Role deve ser um valor válido' })
  role: UserRole
}
