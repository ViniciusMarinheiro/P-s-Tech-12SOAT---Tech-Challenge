import { Test, TestingModule } from '@nestjs/testing'
import { FindServiceByIdUseCase } from '../application/use-cases/find-service-by-id.use-case'
import { ServiceRepositoryPort } from '../domain/repositories/service.repository.port'
import { CustomException } from '@/common/exceptions/customException'

describe('FindServiceByIdUseCase', () => {
  let useCase: FindServiceByIdUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindServiceByIdUseCase,
        {
          provide: ServiceRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindServiceByIdUseCase>(FindServiceByIdUseCase)
    repository = module.get<ServiceRepositoryPort>(ServiceRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a service by id', async () => {
    const domain = {
      id: 1,
      name: 'A',
      description: null,
      price: 100,
      createdAt: new Date(),
    }
    repository.findOne.mockResolvedValue(domain)

    const result = await useCase.execute(1)
    expect(result.id).toBe(1)
  })

  it('should throw if not found', async () => {
    repository.findOne.mockResolvedValue(null)
    await expect(useCase.execute(999)).rejects.toBeInstanceOf(CustomException)
  })
})
