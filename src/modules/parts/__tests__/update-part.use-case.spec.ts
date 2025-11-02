import { Test, TestingModule } from '@nestjs/testing'
import { UpdatePartUseCase } from '../application/use-cases/update-part.use-case'
import { PartRepositoryPort } from '../domain/repositories/part.repository.port'
import { CustomException } from '@/common/exceptions/customException'

describe('UpdatePartUseCase', () => {
  let useCase: UpdatePartUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      update: jest.fn(),
      exists: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePartUseCase,
        { provide: PartRepositoryPort, useValue: mockRepository },
      ],
    }).compile()

    useCase = module.get<UpdatePartUseCase>(UpdatePartUseCase)
    repository = module.get<PartRepositoryPort>(PartRepositoryPort)
  })

  afterEach(() => jest.clearAllMocks())

  it('should update a part when no conflict', async () => {
    const updated = {
      id: 1,
      name: 'X',
      description: null,
      stock: 10,
      unitPrice: 100,
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
