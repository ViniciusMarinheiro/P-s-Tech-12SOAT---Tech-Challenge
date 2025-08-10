import { Test, TestingModule } from '@nestjs/testing'
import { VehiclesController } from './vehicles.controller'
import { VehiclesService } from './vehicles.service'
import { CreateVehiclesDto } from './dto/create-vehicles.dto'
import { UpdateVehiclesDto } from './dto/update-vehicles.dto'
import { VehiclesResponseDto } from './dto/vehicles-response.dto'
import { CustomerResponseDto } from '@/modules/customers/dto/customer-response.dto'


// Mock do VehiclesService para simular seu comportamento
const mockVehiclesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
}

describe('VehiclesController', () => {
  let controller: VehiclesController
  let service: jest.Mocked<VehiclesService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
      ],
    }).compile()

    controller = module.get<VehiclesController>(VehiclesController)
    service = module.get(VehiclesService)
  })

  // Limpa os mocks após cada teste
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

      const createDto: CreateVehiclesDto = {
        model: 'Gol',
        brand: 'Volkswagen',
        year: 2020,
        plate: 'ABC1D23',
        customerId: customerResponse.id,
      }
      const expectedResult: VehiclesResponseDto = { id: 1, ...createDto, createdAt: new Date(), updatedAt: new Date(), customer: customerResponse }
      service.create.mockResolvedValue(expectedResult)

      const result = await controller.create(createDto)

      expect(result).toEqual(expectedResult)
      expect(service.create).toHaveBeenCalledWith(createDto)
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
      const expectedResult: VehiclesResponseDto[] = [
        { id: 1, model: 'Gol', brand: 'Volkswagen', year: 2020, plate: 'ABC1D23', customerId: 1, createdAt: new Date(), updatedAt: new Date(), customer: customerResponse },
      ]
      service.findAll.mockResolvedValue(expectedResult)

      const result = await controller.findAll()

      expect(result).toEqual(expectedResult)
      expect(service.findAll).toHaveBeenCalled()
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
      const expectedResult: VehiclesResponseDto = { id: vehicleId, model: 'Gol', brand: 'Volkswagen', year: 2020, plate: 'ABC1D23', customerId: 1, createdAt: new Date(), updatedAt: new Date(), customer: customerResponse }
      service.findOne.mockResolvedValue(expectedResult)

      const result = await controller.findOne(vehicleId)

      expect(result).toEqual(expectedResult)
      expect(service.findOne).toHaveBeenCalledWith(vehicleId)
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
      const updateDto: UpdateVehiclesDto = { year: 2021 }
      const expectedResult: VehiclesResponseDto = { id: vehicleId, model: 'Gol', brand: 'Volkswagen', year: 2021, plate: 'ABC1D23', customerId: 1, createdAt: new Date(), updatedAt: new Date(), customer: customerResponse }
      service.update.mockResolvedValue(expectedResult)

      const result = await controller.update(vehicleId, updateDto)

      expect(result).toEqual(expectedResult)
      expect(service.update).toHaveBeenCalledWith(vehicleId, updateDto)
    })
  })
})