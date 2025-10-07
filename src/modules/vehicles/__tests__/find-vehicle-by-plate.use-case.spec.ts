import { Test, TestingModule } from '@nestjs/testing'
import { FindVehicleByPlateUseCase } from '../application/use-cases/find-vehicle-by-plate.use-case'
import { VehiclesRepositoryPort } from '../domain/repositories/vehicles.repository.port'
import { VehicleDomain } from '../domain/entities/vehicle.entity'

describe('FindVehicleByPlateUseCase', () => {
  let useCase: FindVehicleByPlateUseCase
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
        FindVehicleByPlateUseCase,
        {
          provide: VehiclesRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindVehicleByPlateUseCase>(FindVehicleByPlateUseCase)
    repository = module.get<VehiclesRepositoryPort>(VehiclesRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should find a vehicle by plate successfully', async () => {
    const plate = 'ABC1234'
    const expectedVehicle = VehicleDomain.fromProps({
      id: 1,
      customerId: 1,
      plate: 'ABC1234',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    repository.findByPlate.mockResolvedValue(expectedVehicle)

    const result = await useCase.execute(plate)

    expect(result).toEqual(expectedVehicle)
    expect(repository.findByPlate).toHaveBeenCalledWith(plate)
  })

  it('should return null when vehicle is not found', async () => {
    const plate = 'XYZ9999'
    repository.findByPlate.mockResolvedValue(null)

    const result = await useCase.execute(plate)

    expect(result).toBeNull()
    expect(repository.findByPlate).toHaveBeenCalledWith(plate)
  })
})
