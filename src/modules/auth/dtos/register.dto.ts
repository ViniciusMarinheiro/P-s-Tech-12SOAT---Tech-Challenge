import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Validate,
} from 'class-validator'
import { DocumentValidator } from '../../../common/validators/document.validator'

export class RegisterDto {
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
    description: 'Senha do usuário',
    example: 'minhasenha123',
    minLength: 6,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string
}
