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
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Customer } from './entities/customer.entity'
import { CustomersService } from './customers.service'

@ApiBearerAuth('Bearer')
@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: Customer,
  })
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(createCustomerDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'List of customers',
    type: [Customer],
  })
  findAll(): Promise<Customer[]> {
    return this.customersService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by id' })
  @ApiResponse({ status: 200, description: 'Customer found', type: Customer })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return this.customersService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: Customer,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.customersService.remove(id)
  }
}
