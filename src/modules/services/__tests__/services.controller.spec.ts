import { Test, TestingModule } from '@nestjs/testing'
import { ServicesController } from '../infrastructure/web/services.controller'
import { CreateServiceUseCase } from '../application/use-cases/create-service.use-case'
import { FindServiceByIdUseCase } from '../application/use-cases/find-service-by-id.use-case'
import { ListServicesUseCase } from '../application/use-cases/list-services.use-case'
import { UpdateServiceUseCase } from '../application/use-cases/update-service.use-case'
import { CreateServiceDto } from '../infrastructure/web/dto/create-service.dto'
import { UpdateServiceDto } from '../infrastructure/web/dto/update-service.dto'
import { ServiceResponseDto } from '../infrastructure/web/dto/service-response.dto'

describe('ServicesController', () => {
  let controller: ServicesController
  let createUC: jest.Mocked<CreateServiceUseCase>
  let findByIdUC: jest.Mocked<FindServiceByIdUseCase>
  let listUC: jest.Mocked<ListServicesUseCase>
  let updateUC: jest.Mocked<UpdateServiceUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        { provide: CreateServiceUseCase, useValue: { execute: jest.fn() } },
        { provide: FindServiceByIdUseCase, useValue: { execute: jest.fn() } },
        { provide: ListServicesUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateServiceUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile()

    controller = module.get<ServicesController>(ServicesController)
    createUC = module.get(CreateServiceUseCase)
    findByIdUC = module.get(FindServiceByIdUseCase)
    listUC = module.get(ListServicesUseCase)
    updateUC = module.get(UpdateServiceUseCase)
  })

  afterEach(() => jest.clearAllMocks())

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('create should delegate to create use case', async () => {
    const dto: CreateServiceDto = { name: 'New Service', price: 200 }
    const expected: ServiceResponseDto = {
      id: 1,
      ...dto,
      createdAt: new Date(),
      description: undefined as any,
    }
    ;(createUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.create(dto)
    expect(result).toEqual(expected)
    expect(createUC.execute).toHaveBeenCalledWith(dto)
  })

  it('findAll should delegate to list use case', async () => {
    const expected: ServiceResponseDto[] = [
      {
        id: 1,
        name: 'Service A',
        price: 150,
        createdAt: new Date(),
        description: 'Service A',
      },
    ]
    ;(listUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.findAll()
    expect(result).toEqual(expected)
    expect(listUC.execute).toHaveBeenCalled()
  })

  it('findOne should delegate to findById use case', async () => {
    const expected: ServiceResponseDto = {
      id: 1,
      name: 'Service A',
      price: 150,
      createdAt: new Date(),
      description: 'Service A',
    }
    ;(findByIdUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.findOne(1)
    expect(result).toEqual(expected)
    expect(findByIdUC.execute).toHaveBeenCalledWith(1)
  })

  it('update should delegate to update use case', async () => {
    const updateDto: UpdateServiceDto = { name: 'Updated' }
    const expected: ServiceResponseDto = {
      id: 1,
      name: 'Updated',
      price: 150,
      createdAt: new Date(),
      description: 'Updated',
    }
    ;(updateUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.update(1, updateDto)
    expect(result).toEqual(expected)
    expect(updateUC.execute).toHaveBeenCalledWith(1, updateDto)
  })
})
