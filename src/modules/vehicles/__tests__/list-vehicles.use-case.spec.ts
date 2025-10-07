import { Test, TestingModule } from '@nestjs/testing'
import { ListVehiclesUseCase } from '../application/use-cases/list-vehicles.use-case'
import { VehiclesRepositoryPort } from '../domain/repositories/vehicles.repository.port'
import { VehicleDomain } from '../domain/entities/vehicle.entity'

describe('ListVehiclesUseCase', () => {
  let useCase: ListVehiclesUseCase
  let repository: any

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPlate: jest.fn(),
      findByCustomerId: jest.fn(),
      update: jest.fn(),
      exists: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListVehiclesUseCase,
        {
          provide: VehiclesRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<ListVehiclesUseCase>(ListVehiclesUseCase)
    repository = module.get<VehiclesRepositoryPort>(VehiclesRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should return a list of vehicles', async () => {
    const expectedVehicles = [
      VehicleDomain.fromProps({
        id: 1,
        customerId: 1,
        plate: 'ABC1234',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      VehicleDomain.fromProps({
        id: 2,
        customerId: 2,
        plate: 'XYZ5678',
        brand: 'Honda',
        model: 'Civic',
        year: 2019,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]

    repository.findAll.mockResolvedValue(expectedVehicles)

    const result = await useCase.execute()

    expect(result).toEqual(expectedVehicles)
    expect(repository.findAll).toHaveBeenCalled()
  })

  it('should return empty array when no vehicles exist', async () => {
    repository.findAll.mockResolvedValue([])

    const result = await useCase.execute()

    expect(result).toEqual([])
    expect(repository.findAll).toHaveBeenCalled()
  })
})
