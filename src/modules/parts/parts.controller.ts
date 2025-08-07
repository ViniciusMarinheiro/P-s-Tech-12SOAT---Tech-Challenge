import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { PartsService } from './parts.service'
import { CreatePartDto } from './dto/create-part.dto'
import { UpdatePartDto } from './dto/update-part.dto'
import { PartResponseDto } from './dto/part-response.dto'
import { Roles } from '@/common/decorators/roles.decorator'
import { UserRole } from '../auth/enums/user-role.enum'

@ApiTags('Parts')
@ApiBearerAuth('Bearer')
@Controller('parts')
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

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
  create(@Body() createPartDto: CreatePartDto): Promise<PartResponseDto> {
    return this.partsService.create(createPartDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as peças' })
  @ApiResponse({
    status: 200,
    description: 'Lista de peças',
    type: [PartResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  findAll(): Promise<PartResponseDto[]> {
    return this.partsService.findAll()
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
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PartResponseDto> {
    return this.partsService.findOne(id)
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartDto: UpdatePartDto,
  ): Promise<PartResponseDto> {
    return this.partsService.update(id, updatePartDto)
  }
}
