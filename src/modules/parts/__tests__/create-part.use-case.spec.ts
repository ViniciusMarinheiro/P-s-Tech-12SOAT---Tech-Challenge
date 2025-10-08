import { Test, TestingModule } from '@nestjs/testing'
import { CreatePartUseCase } from '../application/use-cases/create-part.use-case'
import { PartRepositoryPort } from '../domain/repositories/part.repository.port'
import { CreatePartInput } from '../domain/interfaces/create-part.input.interface'
import { PartDomain } from '../domain/entities/part.entity'

describe('CreatePartUseCase', () => {
  let useCase: CreatePartUseCase
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
        CreatePartUseCase,
        {
          provide: PartRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<CreatePartUseCase>(CreatePartUseCase)
    repository = module.get<PartRepositoryPort>(PartRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should create a part successfully', async () => {
    const input: CreatePartInput = {
      name: 'Part A',
      description: 'Description A',
      stock: 10,
      unitPrice: 100,
    }

    const expected = PartDomain.fromProps({
      id: 1,
      name: input.name,
      description: input.description || null,
      stock: input.stock || 0,
      unitPrice: input.unitPrice,
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
