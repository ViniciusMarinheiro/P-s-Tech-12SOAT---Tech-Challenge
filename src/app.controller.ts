import { Controller, Get } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { AppService } from './app.service'
import { Public } from './common/decorators/public.decorator'

@ApiTags('App')
@Controller()
@ApiBearerAuth('Bearer')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @ApiOperation({ summary: 'Endpoint público de teste' })
  @ApiResponse({ status: 200, description: 'Retorna mensagem de boas-vindas' })
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @ApiOperation({ summary: 'Endpoint protegido de teste' })
  @ApiResponse({
    status: 200,
    description: 'Retorna status da aplicação (requer autenticação)',
  })
  @Get('status')
  getStatus(): { status: string; timestamp: string } {
    return {
      status: 'API funcionando corretamente',
      timestamp: new Date().toISOString(),
    }
  }
}
