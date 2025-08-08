import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SendEmailDto {
  @ApiProperty({
    description: 'E-mail do destinatário',
    example: 'jhondoe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  recipient: string

  @ApiProperty({
    description: 'Título do e-mail',
    example: 'Vendas',
  })
  @IsNotEmpty()
  @IsString()
  subject: string

  @ApiPropertyOptional({
    description: 'Corpo do email',
    example: 'teste',
  })
  @IsOptional()
  @IsString()
  body?: string

  @ApiPropertyOptional({
    description:
      'Nome do usuário, usado apenas para quando o usuário precisa usar código',
    example: 'teste',
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({
    description:
      'Tipo do e-mail, usado apenas para quando o usuário precisa usar código',
  })
  @IsOptional()
  @IsString()
  type?: 'confirmation' | 'forgotPassword'

  @ApiPropertyOptional({
    description:
      'Código, usado apenas para quando o usuário precisa usar código',
    example: 'teste',
  })
  @IsOptional()
  @IsString()
  code?: string

  @ApiPropertyOptional({
    description: 'Anexos do e-mail',
    example: 'teste',
  })
  @IsOptional()
  @IsString()
  attachments?: Array<{
    filename: string
    content: string
    cid?: string
    encoding?: string
  }>
}
