import { Test, TestingModule } from '@nestjs/testing'
import { UpdateCustomerUseCase } from '../application/use-cases/update-customer.use-case'
import { CustomerRepositoryPort } from '../domain/repositories/customer.repository.port'
import { CustomException } from '@/common/exceptions/customException'

describe('UpdateCustomerUseCase', () => {
  let useCase: UpdateCustomerUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      update: jest.fn(),
      exists: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCustomerUseCase,
        { provide: CustomerRepositoryPort, useValue: mockRepository },
      ],
    }).compile()

    useCase = module.get<UpdateCustomerUseCase>(UpdateCustomerUseCase)
    repository = module.get<CustomerRepositoryPort>(CustomerRepositoryPort)
  })

  afterEach(() => jest.clearAllMocks())

  it('should update a customer when no conflict', async () => {
    const updated = {
      id: 1,
      name: 'X',
      documentNumber: '123.456.789-00',
      phone: '(11) 99999-9999',
      email: 'customer@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    repository.exists.mockResolvedValue({ exists: false })
    repository.update.mockResolvedValue(updated)
    const result = await useCase.execute(1, { name: 'X' })
    expect(result).toEqual(updated)
  })

  it('should throw when document already exists', async () => {
    repository.exists.mockResolvedValue({
      exists: true,
      field: 'documentNumber',
      value: '123.456.789-00',
    })
    await expect(
      useCase.execute(1, { documentNumber: '123.456.789-00' }),
    ).rejects.toBeInstanceOf(CustomException)
  })
})
