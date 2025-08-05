import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { DocumentType } from '../../auth/enums/document-type.enum'

export class CreateCustomerDto {
  @ApiProperty({ description: 'Nome do cliente' })
  @IsString()
  name: string

  @ApiProperty({ enum: DocumentType, description: 'Tipo de documento' })
  @IsEnum(DocumentType)
  document_type: DocumentType

  @ApiProperty({ description: 'Número do documento' })
  @IsString()
  documentNumber: string

  @ApiProperty({ description: 'Telefone do cliente', required: false })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ description: 'Email do cliente', required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ description: 'Senha do cliente', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string
}
