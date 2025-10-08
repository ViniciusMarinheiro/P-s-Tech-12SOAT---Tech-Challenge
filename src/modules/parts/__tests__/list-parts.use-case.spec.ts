import { Test, TestingModule } from '@nestjs/testing'
import { ListPartsUseCase } from '../application/use-cases/list-parts.use-case'
import { PartRepositoryPort } from '../domain/repositories/part.repository.port'

describe('ListPartsUseCase', () => {
  let useCase: ListPartsUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListPartsUseCase,
        { provide: PartRepositoryPort, useValue: mockRepository },
      ],
    }).compile()

    useCase = module.get<ListPartsUseCase>(ListPartsUseCase)
    repository = module.get<PartRepositoryPort>(PartRepositoryPort)
  })

  afterEach(() => jest.clearAllMocks())

  it('should list parts', async () => {
    const list = [
      {
        id: 1,
        name: 'A',
        description: null,
        stock: 10,
        unitPrice: 100,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: 'B',
        description: null,
        stock: 20,
        unitPrice: 200,
        createdAt: new Date(),
      },
    ]
    repository.findAll.mockResolvedValue(list)
    const result = await useCase.execute()
    expect(result.length).toBe(2)
  })
})
