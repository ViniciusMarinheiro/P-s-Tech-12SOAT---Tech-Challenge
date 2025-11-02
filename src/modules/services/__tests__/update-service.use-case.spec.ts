import { Test, TestingModule } from '@nestjs/testing'
import { UpdateServiceUseCase } from '../application/use-cases/update-service.use-case'
import { ServiceRepositoryPort } from '../domain/repositories/service.repository.port'
import { CustomException } from '@/common/exceptions/customException'

describe('UpdateServiceUseCase', () => {
  let useCase: UpdateServiceUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      update: jest.fn(),
      exists: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateServiceUseCase,
        { provide: ServiceRepositoryPort, useValue: mockRepository },
      ],
    }).compile()

    useCase = module.get<UpdateServiceUseCase>(UpdateServiceUseCase)
    repository = module.get<ServiceRepositoryPort>(ServiceRepositoryPort)
  })

  afterEach(() => jest.clearAllMocks())

  it('should update a service when no conflict', async () => {
    const updated = {
      id: 1,
      name: 'X',
      description: null,
      price: 100,
      createdAt: new Date(),
    }
    repository.exists.mockResolvedValue({ exists: false })
    repository.update.mockResolvedValue(updated)
    const result = await useCase.execute(1, { name: 'X' })
    expect(result).toEqual(updated)
  })

  it('should throw when name already exists', async () => {
    repository.exists.mockResolvedValue({
      exists: true,
      field: 'name',
      value: 'X',
    })
    await expect(useCase.execute(1, { name: 'X' })).rejects.toBeInstanceOf(
      CustomException,
    )
  })
})
