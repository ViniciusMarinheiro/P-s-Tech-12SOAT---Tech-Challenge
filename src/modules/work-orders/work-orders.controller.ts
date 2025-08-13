import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Query,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { WorkOrdersService } from './work-orders.service'
import { CreateWorkOrderDto } from './dto/create-work-order.dto'
import { UpdateWorkOrderDto } from './dto/update-work-order.dto'
import { WorkOrderResponseDto } from './dto/work-order-response.dto'
import { WorkOrderStatusEnum } from './enum/work-order-status.enum'
import { GetCurrentUserId } from '@/common/decorators/get-current-user-id.decorator'
import { WorkOrderFilterDto } from './dto/work-order-filter.dto'
import { UpdateWorkOrderStatusDto } from './dto/update-work-order-status.dto'
import { Public } from '@/common/decorators'

@ApiTags('work-orders')
@ApiBearerAuth('Bearer')
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova ordem de serviço' })
  @ApiResponse({
    status: 201,
    description: 'Ordem de serviço criada com sucesso',
  })
  create(
    @Body() createWorkOrderDto: CreateWorkOrderDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.workOrdersService.create(createWorkOrderDto, userId)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as ordens de serviço' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ordens de serviço',
    type: [WorkOrderResponseDto],
  })
  findAll(@Query() workOrderFilterDto: WorkOrderFilterDto) {
    return this.workOrdersService.findAll(workOrderFilterDto)
  }

  @Get('customer/:document')
  @ApiOperation({ summary: 'Buscar ordens de serviço por CPF/CNPJ do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Ordens de serviço do cliente',
    type: [WorkOrderResponseDto],
  })
  @ApiParam({
    name: 'document',
    description: 'CPF ou CNPJ do cliente',
    example: '123.456.789-00',
  })
  findByCustomerDocument(@Param('document') document: string) {
    return this.workOrdersService.findByCustomerDocument(document)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar ordem de serviço por ID' })
  @ApiResponse({
    status: 200,
    description: 'Ordem de serviço encontrada',
    type: WorkOrderResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
    example: 1,
  })
  findOne(@Param('id') id: string) {
    return this.workOrdersService.findById(+id)
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Obter progresso da ordem de serviço' })
  @ApiResponse({
    status: 200,
    description: 'Progresso da ordem de serviço',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        status: { type: 'string' },
        statusDescription: { type: 'string' },
        progress: { type: 'number' },
        estimatedCompletion: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
    example: 1,
  })
  getProgress(@Param('id') id: string) {
    return this.workOrdersService.getWorkOrderProgress(+id)
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar ordem de serviço (apenas se status for RECEIVED)',
  })
  @ApiResponse({
    status: 200,
    description: 'Ordem de serviço atualizada com sucesso',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
    example: 1,
  })
  update(
    @Param('id') id: string,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
  ) {
    return this.workOrdersService.update(+id, updateWorkOrderDto)
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da ordem de serviço' })
  @ApiResponse({
    status: 200,
    description: 'Status da ordem de serviço atualizado com sucesso',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da ordem de serviço',
    example: 1,
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateWorkOrderStatusDto: UpdateWorkOrderStatusDto,
  ): Promise<void> {
    return this.workOrdersService.updateStatus(
      +id,
      updateWorkOrderStatusDto.status,
    )
  }

  @Public()
  @Get('/view/:hashView')
  @ApiOperation({ summary: 'Buscar ordem de serviço por hash de visualização' })
  @ApiResponse({
    status: 200,
    description: 'Ordem de serviço encontrada',
    type: WorkOrderResponseDto,
  })
  @ApiParam({
    name: 'hashView',
    description: 'Hash de visualização da ordem de serviço',
    example: '1234567890',
  })
  findByHashView(@Param('hashView') hashView: string) {
    return this.workOrdersService.findByHashView(hashView)
  }

  @Public()
  @Get('/approve/:hashView')
  @ApiOperation({
    summary: 'Aprovar ordem de serviço por hash de visualização',
  })
  @ApiParam({
    name: 'hashView',
    description: 'Hash de visualização da ordem de serviço',
    example: '1234567890',
  })
  approveHashView(@Param('hashView') hashView: string) {
    return this.workOrdersService.approveHashView(hashView)
  }
}
