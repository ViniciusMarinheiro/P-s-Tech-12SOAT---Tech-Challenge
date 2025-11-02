import { Test, TestingModule } from '@nestjs/testing'
import { CreateCustomerUseCase } from '../application/use-cases/create-customer.use-case'
import { CustomerRepositoryPort } from '../domain/repositories/customer.repository.port'
import { CreateCustomerInput } from '../domain/interfaces/create-customer.input.interface'
import { CustomerDomain } from '../domain/entities/customer.entity'

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByEmail: jest.fn(),
      findByDocument: jest.fn(),
      findOneByDocument: jest.fn(),
      update: jest.fn(),
      exists: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCustomerUseCase,
        {
          provide: CustomerRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<CreateCustomerUseCase>(CreateCustomerUseCase)
    repository = module.get<CustomerRepositoryPort>(CustomerRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should create a customer successfully', async () => {
    const input: CreateCustomerInput = {
      name: 'Customer A',
      documentNumber: '123.456.789-00',
      phone: '(11) 99999-9999',
      email: 'customer@example.com',
    }

    const expected = CustomerDomain.fromProps({
      id: 1,
      name: input.name,
      documentNumber: input.documentNumber,
      phone: input.phone || null,
      email: input.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    repository.exists.mockResolvedValue({ exists: false })
    repository.create.mockResolvedValue(expected)

    const result = await useCase.execute(input)

    expect(result).toEqual(expected)
    expect(repository.exists).toHaveBeenCalledWith(
      input.documentNumber,
      input.email,
      input.phone,
    )
    expect(repository.create).toHaveBeenCalledWith(input)
  })
})
