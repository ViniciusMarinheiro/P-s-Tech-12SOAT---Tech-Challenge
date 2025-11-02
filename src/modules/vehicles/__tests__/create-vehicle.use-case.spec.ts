import { Test, TestingModule } from '@nestjs/testing'
import { CreateVehicleUseCase } from '../application/use-cases/create-vehicle.use-case'
import { VehiclesRepositoryPort } from '../domain/repositories/vehicles.repository.port'
import { CreateVehicleInput } from '../domain/interfaces/create-vehicle.input.interface'
import { VehicleDomain } from '../domain/entities/vehicle.entity'

describe('CreateVehicleUseCase', () => {
  let useCase: CreateVehicleUseCase
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
        CreateVehicleUseCase,
        {
          provide: VehiclesRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<CreateVehicleUseCase>(CreateVehicleUseCase)
    repository = module.get<VehiclesRepositoryPort>(VehiclesRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should create a vehicle successfully', async () => {
    const input: CreateVehicleInput = {
      customerId: 1,
      plate: 'ABC1234',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
    }

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

    repository.create.mockResolvedValue(expectedVehicle)

    const result = await useCase.execute(input)

    expect(result).toEqual(expectedVehicle)
    expect(repository.create).toHaveBeenCalledWith(input)
  })
})
