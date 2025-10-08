import { Test, TestingModule } from '@nestjs/testing'
import { CreateServiceUseCase } from '../application/use-cases/create-service.use-case'
import { ServiceRepositoryPort } from '../domain/repositories/service.repository.port'
import { CreateServiceInput } from '../domain/interfaces/create-service.input.interface'
import { ServiceDomain } from '../domain/entities/service.entity'

describe('CreateServiceUseCase', () => {
  let useCase: CreateServiceUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
      exists: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateServiceUseCase,
        {
          provide: ServiceRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<CreateServiceUseCase>(CreateServiceUseCase)
    repository = module.get<ServiceRepositoryPort>(ServiceRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should create a service successfully', async () => {
    const input: CreateServiceInput = {
      name: 'Service A',
      description: 'Description A',
      price: 100,
    }

    const expected = ServiceDomain.fromProps({
      id: 1,
      name: input.name,
      description: input.description || null,
      price: input.price,
      createdAt: new Date(),
    })

    repository.exists.mockResolvedValue({ exists: false })
    repository.create.mockResolvedValue(expected)

    const result = await useCase.execute(input)

    expect(result).toEqual(expected)
    expect(repository.exists).toHaveBeenCalledWith(input.name)
    expect(repository.create).toHaveBeenCalledWith(input)
  })
})
