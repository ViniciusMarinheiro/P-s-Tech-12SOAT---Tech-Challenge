import { Test, TestingModule } from '@nestjs/testing'
import { FindPartByIdUseCase } from '../application/use-cases/find-part-by-id.use-case'
import { PartRepositoryPort } from '../domain/repositories/part.repository.port'
import { CustomException } from '@/common/exceptions/customException'

describe('FindPartByIdUseCase', () => {
  let useCase: FindPartByIdUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindPartByIdUseCase,
        {
          provide: PartRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindPartByIdUseCase>(FindPartByIdUseCase)
    repository = module.get<PartRepositoryPort>(PartRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a part by id', async () => {
    const domain = {
      id: 1,
      name: 'A',
      description: null,
      stock: 10,
      unitPrice: 100,
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
