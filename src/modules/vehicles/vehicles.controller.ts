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
import { CreateVehiclesDto } from './dto/create-vehicles.dto'
import { UpdateVehiclesDto } from './dto/update-vehicles.dto'
import { VehiclesService } from './vehicles.service'
import { VehiclesResponseDto } from './dto/vehicles-response.dto'

@ApiBearerAuth('Bearer')
@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicles' })
  @ApiResponse({
    status: 201,
    description: 'Vehicles created successfully',
    type: VehiclesResponseDto,
  })
  create(
    @Body() createVehiclesDto: CreateVehiclesDto,
  ): Promise<VehiclesResponseDto> {
    return this.vehiclesService.create(createVehiclesDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'List of vehicles',
    type: [VehiclesResponseDto],
  })
  findAll(): Promise<VehiclesResponseDto[]> {
    return this.vehiclesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicles by id' })
  @ApiResponse({
    status: 200,
    description: 'Vehicles found',
    type: VehiclesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Vehicles not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<VehiclesResponseDto> {
    return this.vehiclesService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Vehicles updated successfully',
    type: VehiclesResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Vehicles not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehiclesDto: UpdateVehiclesDto,
  ): Promise<VehiclesResponseDto> {
    return this.vehiclesService.update(id, updateVehiclesDto)
  }
}
