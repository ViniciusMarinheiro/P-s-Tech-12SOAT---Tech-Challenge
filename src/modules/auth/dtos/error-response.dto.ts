import { ApiProperty } from '@nestjs/swagger'

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 400,
  })
  statusCode: number

  @ApiProperty({
    description: 'Mensagem de erro',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: 'Email já está em uso',
  })
  message: string | string[]

  @ApiProperty({
    description: 'Tipo do erro',
    example: 'Bad Request',
  })
  error: string
}
