import { Test, TestingModule } from '@nestjs/testing'
import { VehiclesController } from '../web/vehicles.controller'
import { CreateVehicleDto } from '../web/dto/create-vehicle.dto'
import { UpdateVehicleDto } from '../web/dto/update-vehicle.dto'
import { VehicleResponseDto } from '../web/dto/vehicle-response.dto'
import { CreateVehicleUseCase } from '../application/use-cases/create-vehicle.use-case'
import { FindVehicleByIdUseCase } from '../application/use-cases/find-vehicle-by-id.use-case'
import { ListVehiclesUseCase } from '../application/use-cases/list-vehicles.use-case'
import { UpdateVehicleUseCase } from '../application/use-cases/update-vehicle.use-case'
import { CustomerResponseDto } from '@/modules/customers/dto/customer-response.dto'

// Mock dos Use Cases para simular seu comportamento
const mockCreateVehicleUseCase = {
  execute: jest.fn(),
}

const mockFindVehicleByIdUseCase = {
  execute: jest.fn(),
}

const mockListVehiclesUseCase = {
  execute: jest.fn(),
}

const mockUpdateVehicleUseCase = {
  execute: jest.fn(),
}

describe('VehiclesController', () => {
  let controller: VehiclesController
  let createVehicleUseCase: jest.Mocked<CreateVehicleUseCase>
  let findVehicleByIdUseCase: jest.Mocked<FindVehicleByIdUseCase>
  let listVehiclesUseCase: jest.Mocked<ListVehiclesUseCase>
  let updateVehicleUseCase: jest.Mocked<UpdateVehicleUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: CreateVehicleUseCase,
          useValue: mockCreateVehicleUseCase,
        },
        {
          provide: FindVehicleByIdUseCase,
          useValue: mockFindVehicleByIdUseCase,
        },
        {
          provide: ListVehiclesUseCase,
          useValue: mockListVehiclesUseCase,
        },
        {
          provide: UpdateVehicleUseCase,
          useValue: mockUpdateVehicleUseCase,
        },
      ],
    }).compile()

    controller = module.get<VehiclesController>(VehiclesController)
    createVehicleUseCase = module.get(CreateVehicleUseCase)
    findVehicleByIdUseCase = module.get(FindVehicleByIdUseCase)
    listVehiclesUseCase = module.get(ListVehiclesUseCase)
    updateVehicleUseCase = module.get(UpdateVehicleUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should call vehiclesService.create and return the created vehicle', async () => {
      const customerResponse: CustomerResponseDto = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        documentNumber: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const createDto: CreateVehicleDto = {
        model: 'Gol',
        brand: 'Volkswagen',
        year: 2020,
        plate: 'ABC1D23',
        customerId: customerResponse.id,
      }
      const expectedResult: VehicleResponseDto = {
        id: 1,
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: undefined, // Customer não é mapeado no controller atual
      }
      mockCreateVehicleUseCase.execute.mockResolvedValue(expectedResult)

      const result = await controller.create(createDto)

      expect(result).toEqual(expectedResult)
      expect(createVehicleUseCase.execute).toHaveBeenCalledWith(createDto)
    })
  })

  describe('findAll', () => {
    it('should call vehiclesService.findAll and return an array of vehicles', async () => {
      const customerResponse: CustomerResponseDto = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        documentNumber: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const expectedResult: VehicleResponseDto[] = [
        {
          id: 1,
          model: 'Gol',
          brand: 'Volkswagen',
          year: 2020,
          plate: 'ABC1D23',
          customerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          customer: undefined, // Customer não é mapeado no controller atual
        },
      ]
      mockListVehiclesUseCase.execute.mockResolvedValue(expectedResult)

      const result = await controller.findAll()

      expect(result).toEqual(expectedResult)
      expect(listVehiclesUseCase.execute).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should call vehiclesService.findOne and return a single vehicle', async () => {
      const customerResponse: CustomerResponseDto = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        documentNumber: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const vehicleId = 1
      const expectedResult: VehicleResponseDto = {
        id: vehicleId,
        model: 'Gol',
        brand: 'Volkswagen',
        year: 2020,
        plate: 'ABC1D23',
        customerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: undefined, // Customer não é mapeado no controller atual
      }
      mockFindVehicleByIdUseCase.execute.mockResolvedValue(expectedResult)

      const result = await controller.findOne(vehicleId)

      expect(result).toEqual(expectedResult)
      expect(findVehicleByIdUseCase.execute).toHaveBeenCalledWith(vehicleId)
    })
  })

  describe('update', () => {
    it('should call vehiclesService.update and return the updated vehicle', async () => {
      const customerResponse: CustomerResponseDto = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        documentNumber: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const vehicleId = 1
      const updateDto: UpdateVehicleDto = { year: 2021 }
      const expectedResult: VehicleResponseDto = {
        id: vehicleId,
        model: 'Gol',
        brand: 'Volkswagen',
        year: 2021,
        plate: 'ABC1D23',
        customerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: undefined, // Customer não é mapeado no controller atual
      }
      mockUpdateVehicleUseCase.execute.mockResolvedValue(expectedResult)

      const result = await controller.update(vehicleId, updateDto)

      expect(result).toEqual(expectedResult)
      expect(updateVehicleUseCase.execute).toHaveBeenCalledWith(
        vehicleId,
        updateDto,
      )
    })
  })
})
