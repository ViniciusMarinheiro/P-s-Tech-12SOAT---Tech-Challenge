import { Test, TestingModule } from '@nestjs/testing'
import { PartsController } from '../web/parts.controller'
import { CreatePartUseCase } from '../application/use-cases/create-part.use-case'
import { FindPartByIdUseCase } from '../application/use-cases/find-part-by-id.use-case'
import { ListPartsUseCase } from '../application/use-cases/list-parts.use-case'
import { UpdatePartUseCase } from '../application/use-cases/update-part.use-case'
import { CreatePartDto } from '../web/dto/create-part.dto'
import { UpdatePartDto } from '../web/dto/update-part.dto'
import { PartResponseDto } from '../web/dto/part-response.dto'

describe('PartsController', () => {
  let controller: PartsController
  let createUC: jest.Mocked<CreatePartUseCase>
  let findByIdUC: jest.Mocked<FindPartByIdUseCase>
  let listUC: jest.Mocked<ListPartsUseCase>
  let updateUC: jest.Mocked<UpdatePartUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartsController],
      providers: [
        { provide: CreatePartUseCase, useValue: { execute: jest.fn() } },
        { provide: FindPartByIdUseCase, useValue: { execute: jest.fn() } },
        { provide: ListPartsUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdatePartUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile()

    controller = module.get<PartsController>(PartsController)
    createUC = module.get(CreatePartUseCase)
    findByIdUC = module.get(FindPartByIdUseCase)
    listUC = module.get(ListPartsUseCase)
    updateUC = module.get(UpdatePartUseCase)
  })

  afterEach(() => jest.clearAllMocks())

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('create should delegate to create use case', async () => {
    const dto: CreatePartDto = { name: 'New Part', stock: 10, unitPrice: 200 }
    const expected: PartResponseDto = {
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
    const expected: PartResponseDto[] = [
      {
        id: 1,
        name: 'Part A',
        stock: 10,
        unitPrice: 150,
        createdAt: new Date(),
        description: 'Part A',
      },
    ]
    ;(listUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.findAll()
    expect(result).toEqual(expected)
    expect(listUC.execute).toHaveBeenCalled()
  })

  it('findOne should delegate to findById use case', async () => {
    const expected: PartResponseDto = {
      id: 1,
      name: 'Part A',
      stock: 10,
      unitPrice: 150,
      createdAt: new Date(),
      description: 'Part A',
    }
    ;(findByIdUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.findOne(1)
    expect(result).toEqual(expected)
    expect(findByIdUC.execute).toHaveBeenCalledWith(1)
  })

  it('update should delegate to update use case', async () => {
    const updateDto: UpdatePartDto = { name: 'Updated' }
    const expected: PartResponseDto = {
      id: 1,
      name: 'Updated',
      stock: 10,
      unitPrice: 150,
      createdAt: new Date(),
      description: 'Updated',
    }
    ;(updateUC.execute as jest.Mock).mockResolvedValue(expected)
    const result = await controller.update(1, updateDto)
    expect(result).toEqual(expected)
    expect(updateUC.execute).toHaveBeenCalledWith(1, updateDto)
  })
})
