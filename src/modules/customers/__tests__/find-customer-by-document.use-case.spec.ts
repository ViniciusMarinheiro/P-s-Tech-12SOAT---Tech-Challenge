import { Test, TestingModule } from '@nestjs/testing'
import { FindCustomerByDocumentUseCase } from '../application/use-cases/find-customer-by-document.use-case'
import { CustomerRepositoryPort } from '../domain/repositories/customer.repository.port'
import { CustomException } from '@/common/exceptions/customException'

describe('FindCustomerByDocumentUseCase', () => {
  let useCase: FindCustomerByDocumentUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      findOneByDocument: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCustomerByDocumentUseCase,
        {
          provide: CustomerRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindCustomerByDocumentUseCase>(
      FindCustomerByDocumentUseCase,
    )
    repository = module.get<CustomerRepositoryPort>(CustomerRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return a customer by document', async () => {
    const domain = {
      id: 1,
      name: 'A',
      documentNumber: '123.456.789-00',
      phone: '(11) 99999-9999',
      email: 'customer@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    repository.findOneByDocument.mockResolvedValue(domain)

    const result = await useCase.execute('123.456.789-00')
    expect(result.id).toBe(1)
  })

  it('should throw if not found', async () => {
    repository.findOneByDocument.mockResolvedValue(null)
    await expect(useCase.execute('999.999.999-99')).rejects.toBeInstanceOf(
      CustomException,
    )
  })
})
