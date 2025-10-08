import { Test, TestingModule } from '@nestjs/testing'
import { ListCustomersUseCase } from '../application/use-cases/list-customers.use-case'
import { CustomerRepositoryPort } from '../domain/repositories/customer.repository.port'

describe('ListCustomersUseCase', () => {
  let useCase: ListCustomersUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListCustomersUseCase,
        { provide: CustomerRepositoryPort, useValue: mockRepository },
      ],
    }).compile()

    useCase = module.get<ListCustomersUseCase>(ListCustomersUseCase)
    repository = module.get<CustomerRepositoryPort>(CustomerRepositoryPort)
  })

  afterEach(() => jest.clearAllMocks())

  it('should list customers', async () => {
    const list = [
      {
        id: 1,
        name: 'A',
        documentNumber: '123.456.789-00',
        phone: '(11) 99999-9999',
        email: 'customer1@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'B',
        documentNumber: '987.654.321-00',
        phone: '(11) 88888-8888',
        email: 'customer2@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    repository.findAll.mockResolvedValue(list)
    const result = await useCase.execute()
    expect(result.length).toBe(2)
  })
})
