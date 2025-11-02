import { CurrentUser, Public, Roles } from '@/common/decorators'
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { LoginUseCase } from '../../application/use-cases/login.use-case'
import { RegisterUseCase } from '../../application/use-cases/register.use-case'
import { GetProfileUseCase } from '../../application/use-cases/get-profile.use-case'
import { LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto'
import { LocalAuthGuard } from '@/common/guards'
import { UserRole } from '../../domain/enums/user-role.enum'
import { AuthUser } from '../../domain/interfaces/auth-response.interface'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UserProfileDto } from './dto/user-profile.dto'

@ApiTags('Autenticação')
@ApiBearerAuth('Bearer')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Public()
  @ApiOperation({
    summary: 'Fazer login no sistema',
    description:
      'Autentica um usuário no sistema e retorna um token JWT válido',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciais inválidas' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(req.user)
  }

  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description:
      'Cria um novo usuário no sistema com as informações fornecidas, apenas administradores podem criar usuários',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado com sucesso',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou usuário já existe',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          oneOf: [
            { type: 'string', example: 'Email já está em uso' },
            {
              type: 'array',
              items: { type: 'string' },
              example: ['Email deve ter um formato válido'],
            },
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.registerUseCase.execute(registerDto)
    return result as RegisterResponseDto
  }

  @ApiOperation({
    summary: 'Obter perfil do usuário autenticado',
    description:
      'Retorna as informações do perfil do usuário atualmente autenticado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil do usuário retornado com sucesso',
    type: UserProfileDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido ou ausente',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Token inválido' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @Get('profile')
  async getProfile(@CurrentUser() user: AuthUser): Promise<UserProfileDto> {
    const result = await this.getProfileUseCase.execute(user.id)
    return result as UserProfileDto
  }
}
