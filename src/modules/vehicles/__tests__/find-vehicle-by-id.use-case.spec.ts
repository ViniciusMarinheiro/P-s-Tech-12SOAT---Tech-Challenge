import { Test, TestingModule } from '@nestjs/testing'
import { FindVehicleByIdUseCase } from '../application/use-cases/find-vehicle-by-id.use-case'
import { VehiclesRepositoryPort } from '../domain/repositories/vehicles.repository.port'
import { VehicleDomain } from '../domain/entities/vehicle.entity'
import { CustomException } from '@/common/exceptions/customException'

describe('FindVehicleByIdUseCase', () => {
  let useCase: FindVehicleByIdUseCase
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
        FindVehicleByIdUseCase,
        {
          provide: VehiclesRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<FindVehicleByIdUseCase>(FindVehicleByIdUseCase)
    repository = module.get<VehiclesRepositoryPort>(VehiclesRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should find a vehicle by id successfully', async () => {
    const vehicleId = 1
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

    repository.findOne.mockResolvedValue(expectedVehicle)

    const result = await useCase.execute(vehicleId)

    expect(result).toEqual(expectedVehicle)
    expect(repository.findOne).toHaveBeenCalledWith(vehicleId)
  })

  it('should throw CustomException when vehicle is not found', async () => {
    const vehicleId = 999
    repository.findOne.mockResolvedValue(null)

    await expect(useCase.execute(vehicleId)).rejects.toThrow(CustomException)
    expect(repository.findOne).toHaveBeenCalledWith(vehicleId)
  })
})
