import { Test, TestingModule } from '@nestjs/testing'
import { WorkOrdersController } from '../infrastructure/web/work-orders.controller'
import { WorkOrderStatusEnum } from '../domain/enums/work-order-status.enum'
import { WorkOrderResponseDto } from '../infrastructure/web/dto/work-order-response.dto'
import { CreateWorkOrderDto } from '../infrastructure/web/dto/create-work-order.dto'
import { UpdateWorkOrderDto } from '../infrastructure/web/dto/update-work-order.dto'
import { WorkOrderFilterDto } from '../infrastructure/web/dto/work-order-filter.dto'
import { UpdateWorkOrderStatusDto } from '../infrastructure/web/dto/update-work-order-status.dto'
import { CreateWorkOrderUseCase } from '../application/use-cases/create-work-order.use-case'
import { FindAllWorkOrdersUseCase } from '../application/use-cases/find-all-work-orders.use-case'
import { FindWorkOrderByIdUseCase } from '../application/use-cases/find-work-order-by-id.use-case'
import { FindWorkOrdersByCustomerDocumentUseCase } from '../application/use-cases/find-work-orders-by-customer-document.use-case'
import { GetWorkOrderProgressUseCase } from '../application/use-cases/get-work-order-progress.use-case'
import { UpdateWorkOrderUseCase } from '../application/use-cases/update-work-order.use-case'
import { UpdateWorkOrderStatusUseCase } from '../application/use-cases/update-work-order-status.use-case'
import { FindWorkOrderByHashViewUseCase } from '../application/use-cases/find-work-orders-by-hash-view.use-case'
import { ApproveHashViewUseCase } from '../application/use-cases/approve-hash-view.use-case'

describe('WorkOrdersController', () => {
  let controller: WorkOrdersController
  let createUseCase: jest.Mocked<CreateWorkOrderUseCase>
  let findAllUseCase: jest.Mocked<FindAllWorkOrdersUseCase>
  let findByIdUseCase: jest.Mocked<FindWorkOrderByIdUseCase>
  let findByDocUseCase: jest.Mocked<FindWorkOrdersByCustomerDocumentUseCase>
  let getProgressUseCase: jest.Mocked<GetWorkOrderProgressUseCase>
  let updateUseCase: jest.Mocked<UpdateWorkOrderUseCase>
  let updateStatusUseCase: jest.Mocked<UpdateWorkOrderStatusUseCase>
  let findByHashUseCase: jest.Mocked<FindWorkOrderByHashViewUseCase>
  let approveHashUseCase: jest.Mocked<ApproveHashViewUseCase>

  const baseWorkOrder: WorkOrderResponseDto = {
    id: 1,
    customerId: 10,
    vehicleId: 20,
    status: WorkOrderStatusEnum.RECEIVED,
    createdAt: new Date(),
    updatedAt: new Date(),
    hashView: 'abc123',
  } as any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrdersController],
      providers: [
        { provide: CreateWorkOrderUseCase, useValue: { execute: jest.fn() } },
        { provide: FindAllWorkOrdersUseCase, useValue: { execute: jest.fn() } },
        { provide: FindWorkOrderByIdUseCase, useValue: { execute: jest.fn() } },
        {
          provide: FindWorkOrdersByCustomerDocumentUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetWorkOrderProgressUseCase,
          useValue: { execute: jest.fn() },
        },
        { provide: UpdateWorkOrderUseCase, useValue: { execute: jest.fn() } },
        {
          provide: UpdateWorkOrderStatusUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: FindWorkOrderByHashViewUseCase,
          useValue: { execute: jest.fn() },
        },
        { provide: ApproveHashViewUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile()

    controller = module.get(WorkOrdersController)
    createUseCase = module.get(CreateWorkOrderUseCase)
    findAllUseCase = module.get(FindAllWorkOrdersUseCase)
    findByIdUseCase = module.get(FindWorkOrderByIdUseCase)
    findByDocUseCase = module.get(FindWorkOrdersByCustomerDocumentUseCase)
    getProgressUseCase = module.get(GetWorkOrderProgressUseCase)
    updateUseCase = module.get(UpdateWorkOrderUseCase)
    updateStatusUseCase = module.get(UpdateWorkOrderStatusUseCase)
    findByHashUseCase = module.get(FindWorkOrderByHashViewUseCase)
    approveHashUseCase = module.get(ApproveHashViewUseCase)
  })

  describe('create', () => {
    it('should create a new work order with userId', async () => {
      const dto: CreateWorkOrderDto = { customerId: 10, vehicleId: 20 } as any
      const userId = 99
      ;(createUseCase.execute as jest.Mock).mockResolvedValue(baseWorkOrder)

      const result = await controller.create(dto, userId)

      expect(createUseCase.execute).toHaveBeenCalledWith(dto, userId)
      expect(result).toEqual(baseWorkOrder)
    })
  })

  describe('findAll', () => {
    it('should return list with applied filter', async () => {
      const filter: WorkOrderFilterDto = {
        status: WorkOrderStatusEnum.RECEIVED,
        customerId: 10,
      } as any

      ;(findAllUseCase.execute as jest.Mock).mockResolvedValue([baseWorkOrder])

      const result = await controller.findAll(filter)
      expect(findAllUseCase.execute).toHaveBeenCalledWith(filter)
      expect(result).toEqual([baseWorkOrder])
    })
  })

  describe('findByCustomerDocument', () => {
    it('should return list for given document', async () => {
      const document = '123.456.789-00'
      ;(findByDocUseCase.execute as jest.Mock).mockResolvedValue([
        baseWorkOrder,
      ])

      const result = await controller.findByCustomerDocument(document)
      expect(findByDocUseCase.execute).toHaveBeenCalledWith(document)
      expect(result).toEqual([baseWorkOrder])
    })
  })

  describe('findOne', () => {
    it('should coerce id to number and return work order', async () => {
      ;(findByIdUseCase.execute as jest.Mock).mockResolvedValue(baseWorkOrder)
      const result = await controller.findOne('1')
      expect(findByIdUseCase.execute).toHaveBeenCalledWith(1)
      expect(result).toEqual(baseWorkOrder)
    })
  })

  describe('getProgress', () => {
    it('should coerce id to number and return progress payload', async () => {
      const payload = {
        id: 1,
        status: WorkOrderStatusEnum.IN_PROGRESS,
        statusDescription: 'Em execução',
        progress: 60,
      }
      ;(getProgressUseCase.execute as jest.Mock).mockResolvedValue(payload)
      const result = await controller.getProgress('1')
      expect(getProgressUseCase.execute).toHaveBeenCalledWith(1)
      expect(result).toEqual(payload)
    })
  })

  describe('update', () => {
    it('should coerce id to number and update work order', async () => {
      const dto: UpdateWorkOrderDto = {
        description: 'Troca de pastilhas',
      } as any
      const updated = { ...baseWorkOrder, ...dto }
      ;(updateUseCase.execute as jest.Mock).mockResolvedValue(updated)

      const result = await controller.update('1', dto)
      expect(updateUseCase.execute).toHaveBeenCalledWith(1, dto)
      expect(result).toEqual(updated)
    })
  })

  describe('updateStatus', () => {
    it('should coerce id and call use-case', async () => {
      const dto: UpdateWorkOrderStatusDto = {
        status: WorkOrderStatusEnum.DIAGNOSING,
      } as any
      ;(updateStatusUseCase.execute as jest.Mock).mockResolvedValue(undefined)
      const result = await controller.updateStatus('5', dto)
      expect(updateStatusUseCase.execute).toHaveBeenCalledWith(5, dto.status)
      expect(result).toBeUndefined()
    })
  })

  describe('findByHashView', () => {
    it('should return work order by hashView', async () => {
      ;(findByHashUseCase.execute as jest.Mock).mockResolvedValue(baseWorkOrder)
      const result = await controller.findByHashView('abc123')
      expect(findByHashUseCase.execute).toHaveBeenCalledWith('abc123')
      expect(result).toEqual(baseWorkOrder)
    })
  })
})
