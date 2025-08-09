import { Test, TestingModule } from '@nestjs/testing'
import { PartsController } from './parts.controller'
import { PartsService } from './parts.service'
import { CreatePartDto } from './dto/create-part.dto'
import { UpdatePartDto } from './dto/update-part.dto'
import { PartResponseDto } from './dto/part-response.dto'
import { UserRole } from '../auth/enums/user-role.enum'

// Mock do PartsService para simular seu comportamento
const mockPartsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
}

describe('PartsController', () => {
  let controller: PartsController
  let service: jest.Mocked<PartsService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartsController],
      providers: [
        {
          provide: PartsService,
          useValue: mockPartsService,
        },
      ],
    }).compile()

    controller = module.get<PartsController>(PartsController)
    service = module.get(PartsService)
  })

  // Limpa os mocks após cada teste
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should call partsService.create and return the created part', async () => {
      const createDto: CreatePartDto = {
        name: 'New Part',
        unitPrice: 150.5,
        stock: 20,
      }
      const expectedResult: PartResponseDto = { id: 1, ...createDto, createdAt: new Date(), description: 'New Part' }
      service.create.mockResolvedValue(expectedResult)

      const result = await controller.create(createDto)

      expect(result).toEqual(expectedResult)
      expect(service.create).toHaveBeenCalledWith(createDto)
    })
  })

  describe('findAll', () => {
    it('should call partsService.findAll and return an array of parts', async () => {
      const expectedResult: PartResponseDto[] = [
        { id: 1, name: 'Part A', unitPrice: 100, stock: 10, createdAt: new Date(), description: 'Part A'},
      ]
      service.findAll.mockResolvedValue(expectedResult)

      const result = await controller.findAll()

      expect(result).toEqual(expectedResult)
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should call partsService.findOne and return a single part', async () => {
      const partId = 1
      const expectedResult: PartResponseDto = { id: partId, name: 'Part A', unitPrice: 100, stock: 10, createdAt: new Date(), description: 'Part A' }
      service.findOne.mockResolvedValue(expectedResult)

      const result = await controller.findOne(partId)

      expect(result).toEqual(expectedResult)
      expect(service.findOne).toHaveBeenCalledWith(partId)
    })
  })

  describe('update', () => {
    it('should call partsService.update and return the updated part', async () => {
      const partId = 1
      const updateDto: UpdatePartDto = { name: 'Updated Part Name' }
      const expectedResult: PartResponseDto = { id: partId, name: 'Updated Part Name', unitPrice: 100, stock: 10, createdAt: new Date(), description: 'Updated Part Name' }
      service.update.mockResolvedValue(expectedResult)

      const result = await controller.update(partId, updateDto)

      expect(result).toEqual(expectedResult)
      expect(service.update).toHaveBeenCalledWith(partId, updateDto)
    })
  })
})
