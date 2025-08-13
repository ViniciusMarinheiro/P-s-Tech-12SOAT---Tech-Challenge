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
            updateFinishedAt: jest.fn(),
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
    const baseWorkOrder: any = {
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
    }

    beforeEach(() => {
      jest.clearAllMocks()
      repo.findById.mockResolvedValue({ ...baseWorkOrder })
      repo.updateStatus.mockResolvedValue(undefined as any)
      repo.updateFinishedAt.mockResolvedValue(undefined as any)
      // evita bater na regra real; focamos no fluxo de envio/atualização
      service['validateStatusTransition'] = jest.fn().mockResolvedValue(undefined)
      jest.spyOn(service['envConfigService'], 'get').mockReturnValue('http://localhost:3333/api')
    })

    it('deve lançar NotFoundException quando ordem não encontrada', async () => {
      repo.findById.mockResolvedValueOnce(null)

      await expect(service.updateStatus(999, WorkOrderStatusEnum.FINISHED))
        .rejects.toBeInstanceOf(NotFoundException)

      expect(repo.findById).toHaveBeenCalledWith(999)
      expect(repo.updateStatus).not.toHaveBeenCalled()
    })

    it('deve lançar CustomException quando a transição é inválida', async () => {
      service['validateStatusTransition'] = jest
        .fn()
        .mockRejectedValueOnce(new CustomException('Transição de status inválida'))

      await expect(service.updateStatus(1, WorkOrderStatusEnum.FINISHED))
        .rejects.toBeInstanceOf(CustomException)

      expect(repo.updateStatus).not.toHaveBeenCalled()
    })

    it('deve enviar email quando status = FINISHED', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.FINISHED)

      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: 'cliente@test.com',
          subject: 'Ordem de serviço 1 - Finalizada',
          body: expect.stringContaining('🎉 Ordem de Serviço #1 - Finalizada!'),
        }),
      )
      expect(repo.updateStatus).toHaveBeenCalledWith(1, WorkOrderStatusEnum.FINISHED)
    })

    it('deve enviar 2 emails quando status = IN_PROGRESS (cliente e técnico)', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.IN_PROGRESS)

      expect(emailSpy).toHaveBeenCalledTimes(2)

      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: 'cliente@test.com',
          subject: 'Ordem de serviço 1 - Em andamento',
          body: expect.stringContaining('🔧 Ordem de Serviço #1 - Em Andamento'),
        }),
      )

      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: 'tecnico@test.com',
          subject: 'Ordem de serviço 1 - Confirmada',
          body: expect.stringContaining('📋 Ordem de Serviço #1 - Confirmada'),
        }),
      )

      expect(repo.updateStatus).toHaveBeenCalledWith(1, WorkOrderStatusEnum.IN_PROGRESS)
    })

    it('deve enviar email de aprovação quando transição DIAGNOSING -> AWAITING_APPROVAL', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.AWAITING_APPROVAL)

      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: 'cliente@test.com',
          subject: 'Ordem de serviço 1 - Aguardando aprovação',
          body: expect.stringContaining('🚗 Ordem de Serviço #1 - Aguardando Aprovação'),
        }),
      )

      expect(repo.updateStatus).toHaveBeenCalledWith(1, WorkOrderStatusEnum.AWAITING_APPROVAL)
    })

    it('não deve enviar email de aprovação se status atual != DIAGNOSING', async () => {
      // força status atual para RECEIVED
      repo.findById.mockResolvedValueOnce({ ...baseWorkOrder, status: WorkOrderStatusEnum.RECEIVED })
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.AWAITING_APPROVAL)

      // nenhuma chamada de email neste caso específico (regra do método)
      expect(emailSpy).not.toHaveBeenCalled()
      expect(repo.updateStatus).toHaveBeenCalledWith(1, WorkOrderStatusEnum.AWAITING_APPROVAL)
    })

    it('deve chamar updateFinishedAt e enviar email quando status = DELIVERED', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.DELIVERED)

      expect(repo.updateFinishedAt).toHaveBeenCalledWith(1, expect.any(Date))
      expect(emailSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: 'cliente@test.com',
          subject: 'Ordem de serviço 1 - Entregue com sucesso!',
          body: expect.stringContaining('🎊 Ordem de Serviço #1 - Entregue!'),
        }),
      )
      expect(repo.updateStatus).toHaveBeenCalledWith(1, WorkOrderStatusEnum.DELIVERED)
    })

    it('deve atualizar status no repositório após validações e envios', async () => {
      await service.updateStatus(1, WorkOrderStatusEnum.FINISHED)

      expect(service['validateStatusTransition']).toHaveBeenCalledWith(1, WorkOrderStatusEnum.FINISHED)
      expect(repo.updateStatus).toHaveBeenCalledWith(1, WorkOrderStatusEnum.FINISHED)
    })

    it('deve incluir link de aprovação no email quando status = AWAITING_APPROVAL', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.AWAITING_APPROVAL)

      const emailCall = emailSpy.mock.calls[0][0]
      expect(emailCall.body).toContain('http://localhost:3333/api/work-orders/approve/hash123')
    })

    it('deve incluir data de entrega formatada no email quando status = DELIVERED', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')
      const mockDate = new Date('2024-01-15T10:00:00Z')
      const RealDate = Date
      // mock de Date para controlar a formatação
      // @ts-ignore
      global.Date = class extends RealDate {
        constructor(...args: any[]) {
          super()
          if (args.length === 0) {
            return mockDate as any
          }
          // @ts-ignore
          return new RealDate(...args)
        }
        static now() { return mockDate.getTime() }
      }

      await service.updateStatus(1, WorkOrderStatusEnum.DELIVERED)

      const emailCall = emailSpy.mock.calls[0][0]
      expect(emailCall.body).toContain('15/01/2024')

      global.Date = RealDate
    })

    it('deve incluir detalhes de serviços e peças no email de aprovação', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.AWAITING_APPROVAL)

      const body = emailSpy.mock.calls[0][0].body
      expect(body).toContain('Troca de óleo')
      expect(body).toContain('Filtro de ar')
      expect(body).toContain('Óleo 5W30')
      expect(body).toContain('Filtro de óleo')
      expect(body).toContain('R$ 9800')
    })

    it('deve incluir informações de cliente e veículo no email do técnico (IN_PROGRESS)', async () => {
      const emailSpy = jest.spyOn(service['sendEmailQueueProvider'], 'execute')

      await service.updateStatus(1, WorkOrderStatusEnum.IN_PROGRESS)

      const tecnicoEmailCall = emailSpy.mock.calls[1][0]
      expect(tecnicoEmailCall.body).toContain('Cliente Teste')
      expect(tecnicoEmailCall.body).toContain('Placa ABC-1234')
    })
  })

  describe('validateStatusTransition (método privado)', () => {
    // helper para criar um WO mínimo só com o status
    const mkWO = (status: WorkOrderStatusEnum) =>
      ({ id: 1, status } as any)

    // Garante que usamos a implementação real, mesmo que outro bloco tenha mockado
    beforeEach(() => {
      const realImpl =
        Object.getPrototypeOf(service).validateStatusTransition.bind(service)
      ;(service as any).validateStatusTransition = realImpl
    })

    it.each([
      [WorkOrderStatusEnum.RECEIVED, WorkOrderStatusEnum.DIAGNOSING],
      [WorkOrderStatusEnum.DIAGNOSING, WorkOrderStatusEnum.AWAITING_APPROVAL],
      [WorkOrderStatusEnum.AWAITING_APPROVAL, WorkOrderStatusEnum.IN_PROGRESS],
      [WorkOrderStatusEnum.IN_PROGRESS, WorkOrderStatusEnum.FINISHED],
      [WorkOrderStatusEnum.FINISHED, WorkOrderStatusEnum.DELIVERED],
    ])(
      'deve permitir transição válida: %s -> %s',
      async (from, to) => {
        repo.findById.mockResolvedValueOnce(mkWO(from))

        await expect(
          (service as any).validateStatusTransition(1, to),
        ).resolves.toBeUndefined()

        expect(repo.findById).toHaveBeenCalledWith(1)
      },
    )

    it.each([
      // alguns exemplos inválidos
      [WorkOrderStatusEnum.RECEIVED, WorkOrderStatusEnum.IN_PROGRESS],
      [WorkOrderStatusEnum.RECEIVED, WorkOrderStatusEnum.FINISHED],
      [WorkOrderStatusEnum.DIAGNOSING, WorkOrderStatusEnum.FINISHED],
      [WorkOrderStatusEnum.AWAITING_APPROVAL, WorkOrderStatusEnum.DELIVERED],
      [WorkOrderStatusEnum.FINISHED, WorkOrderStatusEnum.IN_PROGRESS],
      [WorkOrderStatusEnum.DELIVERED, WorkOrderStatusEnum.RECEIVED],
    ])(
      'deve lançar CustomException para transição inválida: %s -> %s',
      async (from, to) => {
        repo.findById.mockResolvedValueOnce(mkWO(from))

        await expect(
          (service as any).validateStatusTransition(1, to),
        ).rejects.toMatchObject({
          constructor: CustomException,
          message: expect.stringContaining(`${from} -> ${to}`),
        })
      },
    )

    it.each([
      WorkOrderStatusEnum.RECEIVED,
      WorkOrderStatusEnum.DIAGNOSING,
      WorkOrderStatusEnum.AWAITING_APPROVAL,
      WorkOrderStatusEnum.IN_PROGRESS,
      WorkOrderStatusEnum.FINISHED,
      WorkOrderStatusEnum.DELIVERED,
    ])('deve considerar inválida a mesma origem/destino: %s -> %s', async (st) => {
      repo.findById.mockResolvedValueOnce(mkWO(st))

      await expect(
        (service as any).validateStatusTransition(1, st),
      ).rejects.toBeInstanceOf(CustomException)
    })

    it('não deve permitir nenhuma transição a partir de DELIVERED', async () => {
      repo.findById.mockResolvedValueOnce(mkWO(WorkOrderStatusEnum.DELIVERED))

      await expect(
        (service as any).validateStatusTransition(1, WorkOrderStatusEnum.FINISHED),
      ).rejects.toBeInstanceOf(CustomException)
    })

    it('deve propagar NotFoundException quando a ordem não existe', async () => {
      repo.findById.mockResolvedValueOnce(null)

      await expect(
        (service as any).validateStatusTransition(999, WorkOrderStatusEnum.DIAGNOSING),
      ).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})
