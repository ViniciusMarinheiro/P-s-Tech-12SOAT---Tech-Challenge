import { Test, TestingModule } from '@nestjs/testing'
import { UpdateVehicleUseCase } from '../application/use-cases/update-vehicle.use-case'
import { VehiclesRepositoryPort } from '../domain/repositories/vehicles.repository.port'
import { UpdateVehicleInput } from '../domain/interfaces/update-vehicle.input.interface'
import { VehicleDomain } from '../domain/entities/vehicle.entity'
import { CustomException } from '@/common/exceptions/customException'

describe('UpdateVehicleUseCase', () => {
  let useCase: UpdateVehicleUseCase
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
        UpdateVehicleUseCase,
        {
          provide: VehiclesRepositoryPort,
          useValue: mockRepository,
        },
      ],
    }).compile()

    useCase = module.get<UpdateVehicleUseCase>(UpdateVehicleUseCase)
    repository = module.get<VehiclesRepositoryPort>(VehiclesRepositoryPort)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  it('should update a vehicle successfully', async () => {
    const vehicleId = 1
    const updateInput: UpdateVehicleInput = {
      year: 2021,
      brand: 'Honda',
    }

    const existingVehicle = VehicleDomain.fromProps({
      id: 1,
      customerId: 1,
      plate: 'ABC1234',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const updatedVehicle = VehicleDomain.fromProps({
      id: 1,
      customerId: 1,
      plate: 'ABC1234',
      brand: 'Honda',
      model: 'Corolla',
      year: 2021,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    repository.findOne.mockResolvedValue(existingVehicle)
    repository.update.mockResolvedValue(updatedVehicle)

    const result = await useCase.execute(vehicleId, updateInput)

    expect(result).toEqual(updatedVehicle)
    expect(repository.findOne).toHaveBeenCalledWith(vehicleId)
    expect(repository.update).toHaveBeenCalledWith(vehicleId, updateInput)
  })

  it('should throw CustomException when vehicle is not found', async () => {
    const vehicleId = 999
    const updateInput: UpdateVehicleInput = { year: 2021 }

    repository.findOne.mockResolvedValue(null)

    await expect(useCase.execute(vehicleId, updateInput)).rejects.toThrow(
      CustomException,
    )
    expect(repository.findOne).toHaveBeenCalledWith(vehicleId)
    expect(repository.update).not.toHaveBeenCalled()
  })
})
