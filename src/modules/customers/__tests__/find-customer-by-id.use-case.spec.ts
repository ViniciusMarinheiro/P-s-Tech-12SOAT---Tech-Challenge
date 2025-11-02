import { Test, TestingModule } from '@nestjs/testing'
import { FindCustomerByIdUseCase } from '../application/use-cases/find-customer-by-id.use-case'
import { CustomerRepositoryPort } from '../domain/repositories/customer.repository.port'
import { CustomException } from '@/common/exceptions/customException'

describe('FindCustomerByIdUseCase', () => {
  let useCase: FindCustomerByIdUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCustomerByIdUseCase,
        {
          provide: CustomerRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindCustomerByIdUseCase>(FindCustomerByIdUseCase)
    repository = module.get<CustomerRepositoryPort>(CustomerRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a customer by id', async () => {
    const domain = {
      id: 1,
      name: 'A',
      documentNumber: '123.456.789-00',
      phone: '(11) 99999-9999',
      email: 'customer@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
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
