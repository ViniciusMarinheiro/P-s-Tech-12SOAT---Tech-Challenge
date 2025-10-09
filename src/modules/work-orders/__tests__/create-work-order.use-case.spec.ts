import { Test, TestingModule } from '@nestjs/testing'
import { CreateWorkOrderUseCase } from '../application/use-cases/create-work-order.use-case'
import { WorkOrderRepositoryPort } from '../domain/repositories/work-order.repository.port'
import { FindServiceByIdUseCase } from '@/modules/services/application/use-cases/find-service-by-id.use-case'
import { FindPartByIdUseCase } from '@/modules/parts/application/use-cases/find-part-by-id.use-case'
import { FindCustomerByIdUseCase } from '@/modules/customers/application/use-cases/find-customer-by-id.use-case'
import { FindVehicleByIdUseCase } from '@/modules/vehicles/application/use-cases/find-vehicle-by-id.use-case'

describe('CreateWorkOrderUseCase', () => {
  let useCase: CreateWorkOrderUseCase
  let repo: jest.Mocked<WorkOrderRepositoryPort>
  let findService: jest.Mocked<FindServiceByIdUseCase>
  let findPart: jest.Mocked<FindPartByIdUseCase>
  let findCustomer: jest.Mocked<FindCustomerByIdUseCase>
  let findVehicle: jest.Mocked<FindVehicleByIdUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateWorkOrderUseCase,
        { provide: WorkOrderRepositoryPort, useValue: { create: jest.fn() } },
        { provide: FindServiceByIdUseCase, useValue: { execute: jest.fn() } },
        { provide: FindPartByIdUseCase, useValue: { execute: jest.fn() } },
        { provide: FindCustomerByIdUseCase, useValue: { execute: jest.fn() } },
        { provide: FindVehicleByIdUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile()

    useCase = module.get(CreateWorkOrderUseCase)
    repo = module.get(WorkOrderRepositoryPort)
    findService = module.get(FindServiceByIdUseCase)
    findPart = module.get(FindPartByIdUseCase)
    findCustomer = module.get(FindCustomerByIdUseCase)
    findVehicle = module.get(FindVehicleByIdUseCase)
  })

  it('should validate customer/vehicle and compute total', async () => {
    ;(findCustomer.execute as jest.Mock).mockResolvedValue({ id: 10 })
    ;(findVehicle.execute as jest.Mock).mockResolvedValue({
      id: 20,
      customerId: 10,
    })
    ;(findService.execute as jest.Mock).mockResolvedValue({ id: 1, price: 100 })
    ;(findPart.execute as jest.Mock).mockResolvedValue({ id: 2, unitPrice: 20 })

    const dto: any = {
      customerId: 10,
      vehicleId: 20,
      services: [{ serviceId: 1, quantity: 2 }],
      parts: [{ partId: 2, quantity: 3 }],
    }

    const mockWorkOrder = { id: 1, protocol: 'WO-2024-001' }
    ;(repo.create as jest.Mock).mockResolvedValue(mockWorkOrder)

    const result = await useCase.execute(dto, 99)

    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ ...dto, userId: 99 }),
      26000,
    )
    expect(result).toEqual({ protocol: 'WO-2024-001' })
  })
})
