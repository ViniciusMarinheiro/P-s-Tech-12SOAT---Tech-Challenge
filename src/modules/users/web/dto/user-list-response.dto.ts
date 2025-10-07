import { ApiProperty } from '@nestjs/swagger'
import { UserResponseDto } from './user-response.dto'

export class UserListResponseDto {
  @ApiProperty({
    description: 'Lista de usuários',
    type: [UserResponseDto],
  })
  users: UserResponseDto[]

  @ApiProperty({
    description: 'Total de usuários encontrados',
    example: 10,
  })
  total: number
}
