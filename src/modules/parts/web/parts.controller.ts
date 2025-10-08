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
import { CreatePartDto } from './dto/create-part.dto'
import { UpdatePartDto } from './dto/update-part.dto'
import { PartResponseDto } from './dto/part-response.dto'
import { Roles } from '@/common/decorators/roles.decorator'
import { UserRole } from '../../auth/enums/user-role.enum'
import { CreatePartUseCase } from '../application/use-cases/create-part.use-case'
import { FindPartByIdUseCase } from '../application/use-cases/find-part-by-id.use-case'
import { ListPartsUseCase } from '../application/use-cases/list-parts.use-case'
import { UpdatePartUseCase } from '../application/use-cases/update-part.use-case'

@ApiTags('Parts')
@ApiBearerAuth('Bearer')
@Controller('parts')
export class PartsController {
  constructor(
    private readonly createUseCase: CreatePartUseCase,
    private readonly findByIdUseCase: FindPartByIdUseCase,
    private readonly listUseCase: ListPartsUseCase,
    private readonly updateUseCase: UpdatePartUseCase,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Criar uma nova peça' })
  @ApiResponse({
    status: 201,
    description: 'Peça criada com sucesso',
    type: PartResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async create(@Body() createPartDto: CreatePartDto): Promise<PartResponseDto> {
    const created = await this.createUseCase.execute(createPartDto)
    return { ...created }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as peças' })
  @ApiResponse({
    status: 200,
    description: 'Lista de peças',
    type: [PartResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(): Promise<PartResponseDto[]> {
    const list = await this.listUseCase.execute()
    return list.map((p) => ({ ...p }))
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma peça por ID' })
  @ApiResponse({
    status: 200,
    description: 'Peça encontrada',
    type: PartResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Peça não encontrada' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PartResponseDto> {
    const part = await this.findByIdUseCase.execute(id)
    return { ...part }
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar uma peça' })
  @ApiResponse({
    status: 200,
    description: 'Peça atualizada com sucesso',
    type: PartResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Peça não encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartDto: UpdatePartDto,
  ): Promise<PartResponseDto> {
    const updated = await this.updateUseCase.execute(id, updatePartDto)
    return { ...updated }
  }
}
