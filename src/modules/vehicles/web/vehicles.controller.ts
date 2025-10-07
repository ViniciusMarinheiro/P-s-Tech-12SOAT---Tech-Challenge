import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { CreateVehicleDto } from './dto/create-vehicle.dto'
import { UpdateVehicleDto } from './dto/update-vehicle.dto'
import { VehicleResponseDto } from './dto/vehicle-response.dto'
import { CreateVehicleUseCase } from '../application/use-cases/create-vehicle.use-case'
import { FindVehicleByIdUseCase } from '../application/use-cases/find-vehicle-by-id.use-case'
import { ListVehiclesUseCase } from '../application/use-cases/list-vehicles.use-case'
import { UpdateVehicleUseCase } from '../application/use-cases/update-vehicle.use-case'

@ApiBearerAuth('Bearer')
@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly findVehicleByIdUseCase: FindVehicleByIdUseCase,
    private readonly listVehiclesUseCase: ListVehiclesUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicles' })
  @ApiResponse({
    status: 201,
    description: 'Vehicles created successfully',
    type: VehicleResponseDto,
  })
  async create(
    @Body() createVehicleDto: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.createVehicleUseCase.execute(createVehicleDto)
    return this.mapToResponseDto(vehicle)
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'List of vehicles',
    type: [VehicleResponseDto],
  })
  async findAll(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.listVehiclesUseCase.execute()
    return vehicles.map((vehicle) => this.mapToResponseDto(vehicle))
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicles by id' })
  @ApiResponse({
    status: 200,
    description: 'Vehicles found',
    type: VehicleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Vehicles not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.findVehicleByIdUseCase.execute(id)
    return this.mapToResponseDto(vehicle)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Vehicles updated successfully',
    type: VehicleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Vehicles not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.updateVehicleUseCase.execute(
      id,
      updateVehicleDto,
    )
    return this.mapToResponseDto(vehicle)
  }

  private mapToResponseDto(vehicle: any): VehicleResponseDto {
    const dto = new VehicleResponseDto()
    dto.id = vehicle.id
    dto.customerId = vehicle.customerId
    dto.plate = vehicle.plate
    dto.brand = vehicle.brand
    dto.model = vehicle.model
    dto.year = vehicle.year
    dto.createdAt = vehicle.createdAt
    dto.updatedAt = vehicle.updatedAt
    // Note: customer relation would need to be loaded separately if needed
    return dto
  }
}
