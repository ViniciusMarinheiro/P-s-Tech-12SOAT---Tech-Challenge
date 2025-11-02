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
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerResponseDto } from './dto/customer-response.dto'
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case'
import { FindCustomerByIdUseCase } from '../../application/use-cases/find-customer-by-id.use-case'
import { FindCustomerByDocumentUseCase } from '../../application/use-cases/find-customer-by-document.use-case'
import { ListCustomersUseCase } from '../../application/use-cases/list-customers.use-case'
import { UpdateCustomerUseCase } from '../../application/use-cases/update-customer.use-case'

@ApiBearerAuth('Bearer')
@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly createUseCase: CreateCustomerUseCase,
    private readonly findByIdUseCase: FindCustomerByIdUseCase,
    private readonly findByDocumentUseCase: FindCustomerByDocumentUseCase,
    private readonly listUseCase: ListCustomersUseCase,
    private readonly updateUseCase: UpdateCustomerUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CustomerResponseDto,
  })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const created = await this.createUseCase.execute(createCustomerDto)
    return { ...created }
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'List of customers',
    type: [CustomerResponseDto],
  })
  async findAll(): Promise<CustomerResponseDto[]> {
    const list = await this.listUseCase.execute()
    return list.map((c) => ({ ...c }))
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by id' })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CustomerResponseDto> {
    const customer = await this.findByIdUseCase.execute(id)
    return { ...customer }
  }

  @Get('document/:document')
  @ApiOperation({ summary: 'Get a customer by document' })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findDocument(
    @Param('document') document: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.findByDocumentUseCase.execute(document)
    return { ...customer }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const updated = await this.updateUseCase.execute(id, updateCustomerDto)
    return { ...updated }
  }
}
