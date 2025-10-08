import { Test, TestingModule } from '@nestjs/testing'
import { CustomersController } from '../web/customers.controller'
import { CreateCustomerUseCase } from '../application/use-cases/create-customer.use-case'
import { FindCustomerByIdUseCase } from '../application/use-cases/find-customer-by-id.use-case'
import { FindCustomerByDocumentUseCase } from '../application/use-cases/find-customer-by-document.use-case'
import { ListCustomersUseCase } from '../application/use-cases/list-customers.use-case'
import { UpdateCustomerUseCase } from '../application/use-cases/update-customer.use-case'
import { CreateCustomerDto } from '../web/dto/create-customer.dto'
import { UpdateCustomerDto } from '../web/dto/update-customer.dto'
import { CustomerResponseDto } from '../web/dto/customer-response.dto'

describe('CustomersController', () => {
  let controller: CustomersController
  let createUC: jest.Mocked<CreateCustomerUseCase>
  let findByIdUC: jest.Mocked<FindCustomerByIdUseCase>
  let findByDocumentUC: jest.Mocked<FindCustomerByDocumentUseCase>
  let listUC: jest.Mocked<ListCustomersUseCase>
  let updateUC: jest.Mocked<UpdateCustomerUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        { provide: CreateCustomerUseCase, useValue: { execute: jest.fn() } },
        { provide: FindCustomerByIdUseCase, useValue: { execute: jest.fn() } },
        {
          provide: FindCustomerByDocumentUseCase,
          useValue: { execute: jest.fn() },
        },
        { provide: ListCustomersUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateCustomerUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile()

    controller = module.get<CustomersController>(CustomersController)
    createUC = module.get(CreateCustomerUseCase)
    findByIdUC = module.get(FindCustomerByIdUseCase)
    findByDocumentUC = module.get(FindCustomerByDocumentUseCase)
    listUC = module.get(ListCustomersUseCase)
    updateUC = module.get(UpdateCustomerUseCase)
  })

  afterEach(() => jest.clearAllMocks())

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('create should delegate to create use case', async () => {
    const dto: CreateCustomerDto = {
      name: 'New Customer',
      documentNumber: '123.456.789-00',
      email: 'customer@example.com',
    }
    const expected: CustomerResponseDto = {
      id: 1,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: undefined as any,
    }
    ;(createUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.create(dto)
    expect(result).toEqual(expected)
    expect(createUC.execute).toHaveBeenCalledWith(dto)
  })

  it('findAll should delegate to list use case', async () => {
    const expected: CustomerResponseDto[] = [
      {
        id: 1,
        name: 'Customer A',
        documentNumber: '123.456.789-00',
        email: 'customer@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: '(11) 99999-9999',
      },
    ]
    ;(listUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.findAll()
    expect(result).toEqual(expected)
    expect(listUC.execute).toHaveBeenCalled()
  })

  it('findOne should delegate to findById use case', async () => {
    const expected: CustomerResponseDto = {
      id: 1,
      name: 'Customer A',
      documentNumber: '123.456.789-00',
      email: 'customer@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: '(11) 99999-9999',
    }
    ;(findByIdUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.findOne(1)
    expect(result).toEqual(expected)
    expect(findByIdUC.execute).toHaveBeenCalledWith(1)
  })

  it('findDocument should delegate to findByDocument use case', async () => {
    const expected: CustomerResponseDto = {
      id: 1,
      name: 'Customer A',
      documentNumber: '123.456.789-00',
      email: 'customer@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: '(11) 99999-9999',
    }
    ;(findByDocumentUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.findDocument('123.456.789-00')
    expect(result).toEqual(expected)
    expect(findByDocumentUC.execute).toHaveBeenCalledWith('123.456.789-00')
  })

  it('update should delegate to update use case', async () => {
    const updateDto: UpdateCustomerDto = { name: 'Updated' }
    const expected: CustomerResponseDto = {
      id: 1,
      name: 'Updated',
      documentNumber: '123.456.789-00',
      email: 'customer@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      phone: '(11) 99999-9999',
    }
    ;(updateUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.update(1, updateDto)
    expect(result).toEqual(expected)
    expect(updateUC.execute).toHaveBeenCalledWith(1, updateDto)
  })
})
