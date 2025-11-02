import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { ServiceResponseDto } from './dto/service-response.dto'
import { Roles } from '@/common/decorators/roles.decorator'
import { UserRole } from '@/modules/auth/domain/enums/user-role.enum'
import { CreateServiceUseCase } from '../../application/use-cases/create-service.use-case'
import { FindServiceByIdUseCase } from '../../application/use-cases/find-service-by-id.use-case'
import { ListServicesUseCase } from '../../application/use-cases/list-services.use-case'
import { UpdateServiceUseCase } from '../../application/use-cases/update-service.use-case'

@ApiTags('Services')
@ApiBearerAuth('Bearer')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly createUseCase: CreateServiceUseCase,
    private readonly findByIdUseCase: FindServiceByIdUseCase,
    private readonly listUseCase: ListServicesUseCase,
    private readonly updateUseCase: UpdateServiceUseCase,
  ) {}

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
  async create(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ServiceResponseDto> {
    const created = await this.createUseCase.execute(createServiceDto)
    return { ...created }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os serviços' })
  @ApiResponse({
    status: 200,
    description: 'Lista de serviços',
    type: [ServiceResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(): Promise<ServiceResponseDto[]> {
    const list = await this.listUseCase.execute()
    return list.map((s) => ({ ...s }))
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
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ServiceResponseDto> {
    const service = await this.findByIdUseCase.execute(id)
    return { ...service }
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    const updated = await this.updateUseCase.execute(id, updateServiceDto)
    return { ...updated }
  }
}
