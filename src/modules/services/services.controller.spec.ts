import { Test, TestingModule } from '@nestjs/testing'
import { ServicesController } from './services.controller'
import { ServicesService } from './services.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { ServiceResponseDto } from './dto/service-response.dto'

// Mock do ServicesService para simular seu comportamento
const mockServicesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
}

describe('ServicesController', () => {
  let controller: ServicesController
  let service: jest.Mocked<ServicesService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
      ],
    }).compile()

    controller = module.get<ServicesController>(ServicesController)
    service = module.get(ServicesService)
  })

  // Limpa os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should call servicesService.create and return the created service', async () => {
      const createDto: CreateServiceDto = { name: 'New Service', price: 200 }
      const expectedResult: ServiceResponseDto = { id: 1, ...createDto, createdAt: new Date(), description: 'New Service' }
      service.create.mockResolvedValue(expectedResult)

      const result = await controller.create(createDto)

      expect(result).toEqual(expectedResult)
      expect(service.create).toHaveBeenCalledWith(createDto)
    })
  })

  describe('findAll', () => {
    it('should call servicesService.findAll and return an array of services', async () => {
      const expectedResult: ServiceResponseDto[] = [
        { id: 1, name: 'Service A', price: 150, createdAt: new Date(), description: 'Service A' },
      ]
      service.findAll.mockResolvedValue(expectedResult)

      const result = await controller.findAll()

      expect(result).toEqual(expectedResult)
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should call servicesService.findOne and return a single service', async () => {
      const serviceId = 1
      const expectedResult: ServiceResponseDto = { id: serviceId, name: 'Service A', price: 150, createdAt: new Date(), description: 'Service A' }
      service.findOne.mockResolvedValue(expectedResult)

      const result = await controller.findOne(serviceId)

      expect(result).toEqual(expectedResult)
      expect(service.findOne).toHaveBeenCalledWith(serviceId)
    })
  })

  describe('update', () => {
    it('should call servicesService.update and return the updated service', async () => {
      const serviceId = 1
      const updateDto: UpdateServiceDto = { name: 'Updated Service Name' }
      const expectedResult: ServiceResponseDto = { id: serviceId, name: 'Updated Service Name', price: 150, createdAt: new Date(), description: 'Updated Service Name' }
      service.update.mockResolvedValue(expectedResult)

      const result = await controller.update(serviceId, updateDto)

      expect(result).toEqual(expectedResult)
      expect(service.update).toHaveBeenCalledWith(serviceId, updateDto)
    })
  })
})
