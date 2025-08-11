import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { WorkOrdersService } from './work-orders.service'
import { WorkOrderRepositoryPort } from './repositories/port/work-order.repository.port'
import { VehiclesService } from '../vehicles/vehicles.service'
import { CustomersService } from '../customers/customers.service'
import { ServicesService } from '../services/services.service'
import { PartsService } from '../parts/parts.service'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'
import { CustomException } from '@/common/exceptions/customException'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { WorkOrderStatusEnum } from './enum/work-order-status.enum'

describe('WorkOrdersService', () => {
  let service: WorkOrdersService
  let repo: jest.Mocked<WorkOrderRepositoryPort>
  let vehicles: jest.Mocked<VehiclesService>
  let customers: jest.Mocked<CustomersService>
  let svcs: jest.Mocked<ServicesService>
  let parts: jest.Mocked<PartsService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkOrdersService,
        {
          provide: WorkOrderRepositoryPort,
          useValue: {
            create: jest.fn<Promise<void>, any[]>(),
            findById: jest.fn(),
            findByCustomerId: jest.fn(),
            findByCustomerDocument: jest.fn(),
            findByVehicleId: jest.fn(),
            findByStatus: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        { provide: VehiclesService, useValue: { findOne: jest.fn() } },
        { provide: CustomersService, useValue: { findOne: jest.fn() } },
        { provide: ServicesService, useValue: { findOne: jest.fn() } },
        {
          provide: PartsService,
          useValue: { findOne: jest.fn(), update: jest.fn() },
        },
        { provide: SendEmailQueueProvider, useValue: { execute: jest.fn() } },
        { provide: EnvConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile()

    service = module.get(WorkOrdersService)
    repo = module.get(WorkOrderRepositoryPort)
    vehicles = module.get(VehiclesService)
    customers = module.get(CustomersService)
    svcs = module.get(ServicesService)
    parts = module.get(PartsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('deve validar cliente/veículo, calcular total (serviços + peças) e chamar repo.create com userId', async () => {
      // vínculo ok
      customers.findOne.mockResolvedValue({ id: 10 } as any)
      vehicles.findOne.mockResolvedValue({ id: 20, customerId: 10 } as any)

      // preços em reais, convertToCents = *100 (sem arredondamento aqui)
      svcs.findOne.mockResolvedValue({ id: 1, price: 100 } as any) // 100 → 10000 cents
      parts.findOne.mockResolvedValue({ id: 2, unitPrice: 20 } as any) // 20  → 2000  cents

      const dto: any = {
        customerId: 10,
        vehicleId: 20,
        services: [{ serviceId: 1, quantity: 2 }], // 2 * 10000 = 20000
        parts: [{ partId: 2, quantity: 3 }], // 3 * 2000  = 6000
      }
      const userId = 99

      await service.create(dto, userId)

      // total esperado: 26000
      expect(svcs.findOne).toHaveBeenCalledWith(1)
      expect(parts.findOne).toHaveBeenCalledWith(2)

      // o serviço muta dto.services[].price e dto.parts[].price
      expect(dto.services[0].price).toBe(20000)
      expect(dto.parts[0].price).toBe(6000)

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...dto,
          userId,
        }),
        26000,
      )
    })

    it('deve funcionar quando não há services nem parts (total = 0)', async () => {
      customers.findOne.mockResolvedValue({ id: 10 } as any)
      vehicles.findOne.mockResolvedValue({ id: 20, customerId: 10 } as any)

      const dto: any = { customerId: 10, vehicleId: 20 } // sem services/parts

      await service.create(dto, 1)

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ ...dto, userId: 1 }),
        0,
      )
    })

    it('deve lançar CustomException quando cliente e veículo não correspondem', async () => {
      customers.findOne.mockResolvedValue({ id: 10 } as any)
      vehicles.findOne.mockResolvedValue({ id: 20, customerId: 777 } as any)

      const dto: any = { customerId: 10, vehicleId: 20 }

      await expect(service.create(dto, 1)).rejects.toBeInstanceOf(
        CustomException,
      )
      expect(repo.create).not.toHaveBeenCalled()
    })
  })

  describe('findById', () => {
    it('deve retornar a ordem quando encontrada', async () => {
      const workOrder: any = { id: 123, status: 'RECEIVED' }
      repo.findById.mockResolvedValueOnce(workOrder)

      const res = await service.findById(123)

      expect(repo.findById).toHaveBeenCalledWith(123)
      expect(res).toEqual(workOrder)
    })

    it('should throw NotFoundException when order not found', async () => {
      repo.findById.mockResolvedValueOnce(null)

      await expect(service.findById(999)).rejects.toBeInstanceOf(
        NotFoundException,
      )
      expect(repo.findById).toHaveBeenCalledWith(999)
    })
  })

  describe('findByCustomerId', () => {
    it('deve delegar ao repositório e retornar a lista', async () => {
      const list: any[] = [{ id: 1 }, { id: 2 }]
      repo.findByCustomerId.mockResolvedValueOnce(list)

      const res = await service.findByCustomerId(10)

      expect(repo.findByCustomerId).toHaveBeenCalledWith(10)
      expect(res).toEqual(list)
    })
  })

  describe('findByCustomerDocument', () => {
    it('deve delegar ao repositório e retornar a lista', async () => {
      const list: any[] = [{ id: 3 }]
      repo.findByCustomerDocument.mockResolvedValueOnce(list)

      const res = await service.findByCustomerDocument('123.456.789-00')

      expect(repo.findByCustomerDocument).toHaveBeenCalledWith('123.456.789-00')
      expect(res).toEqual(list)
    })
  })

  describe('findByVehicleId', () => {
    it('deve delegar ao repositório e retornar a lista', async () => {
      const list: any[] = [{ id: 4 }]
      repo.findByVehicleId.mockResolvedValueOnce(list)

      const res = await service.findByVehicleId(20)

      expect(repo.findByVehicleId).toHaveBeenCalledWith(20)
      expect(res).toEqual(list)
    })
  })

  describe('findByStatus', () => {
    it('deve delegar ao repositório e retornar a lista', async () => {
      const list: any[] = [{ id: 5 }]
      repo.findByStatus.mockResolvedValueOnce(list)

      const res = await service.findByStatus('RECEIVED')

      expect(repo.findByStatus).toHaveBeenCalledWith('RECEIVED')
      expect(res).toEqual(list)
    })
  })

  describe('updateStatus', () => {
    const mockWorkOrder = {
      id: 1,
      customerId: 1,
      vehicleId: 1,
      customer: { id: 1, email: 'cliente@test.com', name: 'Cliente Teste' },
      user: { id: 1, email: 'tecnico@test.com', name: 'Técnico Teste' },
      vehicle: { id: 1, plate: 'ABC-1234' },
      services: [
        {
          id: 1,
          serviceId: 1,
          serviceName: 'Troca de óleo',
          quantity: 1,
          unitPrice: 5000,
          totalPrice: 5000,
        },
        {
          id: 2,
          serviceId: 2,
          serviceName: 'Filtro de ar',
          quantity: 1,
          unitPrice: 1500,
          totalPrice: 1500,
        },
      ],
      parts: [
        {
          id: 1,
          partId: 1,
          partName: 'Óleo 5W30',
          quantity: 1,
          unitPrice: 2500,
          totalPrice: 2500,
        },
        {
          id: 2,
          partId: 2,
          partName: 'Filtro de óleo',
          quantity: 1,
          unitPrice: 800,
          totalPrice: 800,
        },
      ],
      totalAmount: 9800,
      status: WorkOrderStatusEnum.DIAGNOSING,
      hashView: 'hash123',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any

    beforeEach(() => {
      jest.clearAllMocks()
      repo.findById.mockResolvedValue(mockWorkOrder)
      repo.updateStatus.mockResolvedValue(mockWorkOrder)
      service['validateStatusTransition'] = jest
        .fn()
        .mockResolvedValue(undefined)
      jest
        .spyOn(service['envConfigService'], 'get')
        .mockReturnValue('http://localhost:3333/api')
    })

    it('deve lançar NotFoundException quando ordem não encontrada', async () => {
      repo.findById.mockResolvedValueOnce(null)

      await expect(
        service.updateStatus(999, WorkOrderStatusEnum.FINISHED),
      ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('should throw CustomException when status is invalid', async () => {
      service['validateStatusTransition'] = jest
        .fn()
        .mockRejectedValueOnce(
          new CustomException('Transição de status inválida'),
        )

      await expect(
        service.updateStatus(1, WorkOrderStatusEnum.FINISHED),
      ).rejects.toBeInstanceOf(CustomException)
    })

    it('should send email when status is FINISHED', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.FINISHED)

      expect(emailSpy).toHaveBeenCalledWith({
        recipient: 'cliente@test.com',
        subject: 'Ordem de serviço 1 - Finalizada',
        body: expect.stringContaining('🎉 Ordem de Serviço #1 - Finalizada!'),
      })
      expect(repo.updateStatus).toHaveBeenCalledWith(
        1,
        WorkOrderStatusEnum.FINISHED,
      )
    })

    it('should send emails when status is IN_PROGRESS', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.IN_PROGRESS)

      expect(emailSpy).toHaveBeenCalledTimes(2)

      // Email for customer
      expect(emailSpy).toHaveBeenCalledWith({
        recipient: 'cliente@test.com',
        subject: 'Ordem de serviço 1 - Em andamento',
        body: expect.stringContaining('🔧 Ordem de Serviço #1 - Em Andamento'),
      })

      // Email for technician
      expect(emailSpy).toHaveBeenCalledWith({
        recipient: 'tecnico@test.com',
        subject: 'Ordem de serviço 1 - Confirmada',
        body: expect.stringContaining('📋 Ordem de Serviço #1 - Confirmada'),
      })

      expect(repo.updateStatus).toHaveBeenCalledWith(
        1,
        WorkOrderStatusEnum.IN_PROGRESS,
      )
    })

    it('should send approval email when transition is DIAGNOSING -> AWAITING_APPROVAL', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.AWAITING_APPROVAL)

      expect(emailSpy).toHaveBeenCalledWith({
        recipient: 'cliente@test.com',
        subject: 'Ordem de serviço 1 - Aguardando aprovação',
        body: expect.stringContaining(
          '🚗 Ordem de Serviço #1 - Aguardando Aprovação',
        ),
      })

      expect(repo.updateStatus).toHaveBeenCalledWith(
        1,
        WorkOrderStatusEnum.AWAITING_APPROVAL,
      )
    })

    it('should send email when status is DELIVERED', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.DELIVERED)

      expect(emailSpy).toHaveBeenCalledWith({
        recipient: 'cliente@test.com',
        subject: 'Ordem de serviço 1 - Entregue com sucesso!',
        body: expect.stringContaining('🎊 Ordem de Serviço #1 - Entregue!'),
      })

      expect(repo.updateStatus).toHaveBeenCalledWith(
        1,
        WorkOrderStatusEnum.DELIVERED,
      )
    })

    it('should update status in repository after sending emails', async () => {
      await service.updateStatus(1, WorkOrderStatusEnum.FINISHED)

      expect(repo.updateStatus).toHaveBeenCalledWith(
        1,
        WorkOrderStatusEnum.FINISHED,
      )
    })

    it('should validate status transition before executing', async () => {
      await service.updateStatus(1, WorkOrderStatusEnum.FINISHED)

      expect(service['validateStatusTransition']).toHaveBeenCalledWith(
        1,
        WorkOrderStatusEnum.FINISHED,
      )
    })

    it('should include approval link in email when status is AWAITING_APPROVAL', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.AWAITING_APPROVAL)

      const emailCall = emailSpy.mock.calls[0][0]
      expect(emailCall.body).toContain(
        'http://localhost:3333/api/work-orders/approve/hash123',
      )
    })

    it('should include delivery date in email when status is DELIVERED', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')
      const mockDate = new Date('2024-01-15 10:00:00')
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any)

      await service.updateStatus(1, WorkOrderStatusEnum.DELIVERED)

      const emailCall = emailSpy.mock.calls[0][0]
      expect(emailCall.body).toContain('15/01/2024')

      jest.restoreAllMocks()
    })

    it('should include service and parts details in approval email', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.AWAITING_APPROVAL)

      const emailCall = emailSpy.mock.calls[0][0]
      expect(emailCall.body).toContain('Troca de óleo')
      expect(emailCall.body).toContain('Filtro de ar')
      expect(emailCall.body).toContain('Óleo 5W30')
      expect(emailCall.body).toContain('Filtro de óleo')
    })

    it('should include total amount in approval email', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.AWAITING_APPROVAL)

      const emailCall = emailSpy.mock.calls[0][0]
      expect(emailCall.body).toContain('R$ 9800')
    })

    it('should include customer and vehicle information in technician email', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.IN_PROGRESS)

      const tecnicoEmailCall = emailSpy.mock.calls[1][0]
      expect(tecnicoEmailCall.body).toContain('Cliente Teste')
      expect(tecnicoEmailCall.body).toContain('Placa ABC-1234')
    })
  })
})
