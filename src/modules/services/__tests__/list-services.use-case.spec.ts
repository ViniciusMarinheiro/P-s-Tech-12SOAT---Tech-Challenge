import { Test, TestingModule } from '@nestjs/testing'
import { ListServicesUseCase } from '../application/use-cases/list-services.use-case'
import { ServiceRepositoryPort } from '../domain/repositories/service.repository.port'

describe('ListServicesUseCase', () => {
  let useCase: ListServicesUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListServicesUseCase,
        { provide: ServiceRepositoryPort, useValue: mockRepository },
      ],
    }).compile()

    useCase = module.get<ListServicesUseCase>(ListServicesUseCase)
    repository = module.get<ServiceRepositoryPort>(ServiceRepositoryPort)
  })

  afterEach(() => jest.clearAllMocks())

  it('should list services', async () => {
    const list = [
      {
        id: 1,
        name: 'A',
        description: null,
        price: 100,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: 'B',
        description: null,
        price: 200,
        createdAt: new Date(),
      },
    ]
    repository.findAll.mockResolvedValue(list)
    const result = await useCase.execute()
    expect(result.length).toBe(2)
  })
})
