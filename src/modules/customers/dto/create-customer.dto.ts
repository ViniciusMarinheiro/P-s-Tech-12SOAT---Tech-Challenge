import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  IsNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsCpfOrCnpj } from '@/common/dto/is-cpf-or-cnpj-constraint'
import { IsPhone } from '@/common/dto/phone.validator'

export class CreateCustomerDto {
  @ApiProperty({ description: 'Nome do cliente' })
  @IsString()
  name: string

  @ApiProperty({ description: 'Número do documento' })
  @IsString()
  @IsCpfOrCnpj()
  documentNumber: string

  @ApiProperty({ description: 'Telefone do cliente', required: false })
  @IsOptional()
  @IsPhone()
  phone?: string

  @ApiProperty({ description: 'Email do cliente' })
  @IsNotEmpty()
  @IsEmail()
  email: string
}
