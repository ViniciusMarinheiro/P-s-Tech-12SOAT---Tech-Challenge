import { Test, TestingModule } from '@nestjs/testing'
import { WorkOrdersController } from './work-orders.controller'
import { WorkOrdersService } from './work-orders.service'
import { WorkOrderStatusEnum } from './enum/work-order-status.enum'
import { WorkOrderResponseDto } from './dto/work-order-response.dto'
import { CreateWorkOrderDto } from './dto/create-work-order.dto'
import { UpdateWorkOrderDto } from './dto/update-work-order.dto'
import { WorkOrderFilterDto } from './dto/work-order-filter.dto'
import { UpdateWorkOrderStatusDto } from './dto/update-work-order-status.dto'

describe('WorkOrdersController', () => {
  let controller: WorkOrdersController
  let service: any

  const baseWorkOrder: WorkOrderResponseDto = {
    id: 1,
    customerId: 10,
    vehicleId: 20,
    description: 'Troca de óleo e filtro',
    status: WorkOrderStatusEnum.RECEIVED,
    createdAt: new Date(),
    updatedAt: new Date(),
    hashView: 'abc123',
  } as any

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrdersController],
      providers: [
        {
          provide: WorkOrdersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByCustomerDocument: jest.fn(),
            findById: jest.fn(),
            getWorkOrderProgress: jest.fn(),
            update: jest.fn(),
            updateStatus: jest.fn(),
            findByHashView: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get(WorkOrdersController)
    service = module.get(WorkOrdersService) as any
  })

  describe('create', () => {
    it('should create a new work order with userId', async () => {
      const dto: CreateWorkOrderDto = {
        customerId: 10,
        vehicleId: 20,
        description: 'Troca de óleo',
      } as any
      const userId = 99

      service.create.mockResolvedValue(baseWorkOrder)

      const result = await controller.create(dto, userId)

      expect(service.create).toHaveBeenCalledWith(dto, userId)
      expect(result).toEqual(baseWorkOrder)
    })

    it('should bubble up service errors', async () => {
      service.create.mockRejectedValue(new Error('Invalid data'))
      await expect(controller.create({} as any, 1)).rejects.toThrow('Invalid data')
    })
  })

  describe('findAll', () => {
    it('should return list with applied filter', async () => {
      const filter: WorkOrderFilterDto = {
        status: WorkOrderStatusEnum.RECEIVED,
        customerId: 10,
      } as any

      service.findAll.mockResolvedValue([baseWorkOrder])

      const result = await controller.findAll(filter)

      expect(service.findAll).toHaveBeenCalledWith(filter)
      expect(result).toEqual([baseWorkOrder])
    })
  })

  describe('findByCustomerDocument', () => {
    it('should return list for given document', async () => {
      const document = '123.456.789-00'
      service.findByCustomerDocument.mockResolvedValue([baseWorkOrder])

      const result = await controller.findByCustomerDocument(document)

      expect(service.findByCustomerDocument).toHaveBeenCalledWith(document)
      expect(result).toEqual([baseWorkOrder])
    })

    it('should propagate errors', async () => {
      service.findByCustomerDocument.mockRejectedValue(new Error('Customer not found'))
      await expect(controller.findByCustomerDocument('000')).rejects.toThrow('Customer not found')
    })
  })

  describe('findOne', () => {
    it('should coerce id to number and return work order', async () => {
      service.findById.mockResolvedValue(baseWorkOrder)

      const result = await controller.findOne('1')

      expect(service.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(baseWorkOrder)
    })

    it('should throw when not found', async () => {
      service.findById.mockRejectedValue(new Error('Not found'))
      await expect(controller.findOne('999')).rejects.toThrow('Not found')
    })
  })

  describe('getProgress', () => {
    it('should coerce id to number and return progress payload', async () => {
      const progressPayload = {
        id: 1,
        status: WorkOrderStatusEnum.IN_PROGRESS,
        statusDescription: 'Em execução',
        progress: 60,
        estimatedCompletion: new Date().toISOString(),
      }
      service.getWorkOrderProgress.mockResolvedValue(progressPayload as any)

      const result = await controller.getProgress('1')

      expect(service.getWorkOrderProgress).toHaveBeenCalledWith(1)
      expect(result).toEqual(progressPayload)
    })

    it('should propagate errors', async () => {
      service.getWorkOrderProgress.mockRejectedValue(new Error('Not found'))
      await expect(controller.getProgress('2')).rejects.toThrow('Not found')
    })
  })

  describe('update', () => {
    it('should coerce id to number and update work order', async () => {
      const dto: UpdateWorkOrderDto = { description: 'Troca de pastilhas' } as any
      const updated = { ...baseWorkOrder, ...dto, status: WorkOrderStatusEnum.RECEIVED }
      service.update.mockResolvedValue(updated as any)

      const result = await controller.update('1', dto)

      expect(service.update).toHaveBeenCalledWith(1, dto)
      expect(result).toEqual(updated)
    })

    it('should throw if update fails', async () => {
      service.update.mockRejectedValue(new Error('Invalid status transition'))
      await expect(controller.update('1', {} as any)).rejects.toThrow('Invalid status transition')
    })
  })

  describe('updateStatus', () => {
    it('should coerce id and call service.updateStatus', async () => {
      const dto: UpdateWorkOrderStatusDto = { status: WorkOrderStatusEnum.DIAGNOSING } as any
      service.updateStatus.mockResolvedValue(undefined)

      const result = await controller.updateStatus('5', dto)

      expect(service.updateStatus).toHaveBeenCalledWith(5, dto.status)
      expect(result).toBeUndefined()
    })

    it('should propagate errors', async () => {
      service.updateStatus.mockRejectedValue(new Error('Status not allowed'))
      await expect(
        controller.updateStatus('5', { status: WorkOrderStatusEnum.FINISHED } as any),
      ).rejects.toThrow('Status not allowed')
    })
  })

  describe('findByHashView', () => {
    it('should return work order by hashView', async () => {
      service.findByHashView.mockResolvedValue(baseWorkOrder)

      const result = await controller.findByHashView('abc123')

      expect(service.findByHashView).toHaveBeenCalledWith('abc123')
      expect(result).toEqual(baseWorkOrder)
    })

    it('should throw when hash not found', async () => {
      service.findByHashView.mockRejectedValue(new Error('Hash not found'))
      await expect(controller.findByHashView('nope')).rejects.toThrow('Hash not found')
    })
  })
})
