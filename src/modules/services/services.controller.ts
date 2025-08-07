import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { ServicesService } from './services.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { ServiceResponseDto } from './dto/service-response.dto'
import { Roles } from '@/common/decorators/roles.decorator'
import { UserRole } from '../auth/enums/user-role.enum'

@ApiTags('Services')
@ApiBearerAuth('Bearer')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar um novo serviço' })
  @ApiResponse({
    status: 201,
    description: 'Serviço criado com sucesso',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  create(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    return this.servicesService.create(createServiceDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os serviços' })
  @ApiResponse({
    status: 200,
    description: 'Lista de serviços',
    type: [ServiceResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(): Promise<ServiceResponseDto[]> {
    return this.servicesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um serviço por ID' })
  @ApiResponse({
    status: 200,
    description: 'Serviço encontrado',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ServiceResponseDto> {
    return this.servicesService.findOne(id)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar um serviço' })
  @ApiResponse({
    status: 200,
    description: 'Serviço atualizado com sucesso',
    type: ServiceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    return this.servicesService.update(id, updateServiceDto)
  }
}
