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
          },
        },
        { provide: VehiclesService, useValue: { findOne: jest.fn() } },
        { provide: CustomersService, useValue: { findOne: jest.fn() } },
        { provide: ServicesService, useValue: { findOne: jest.fn() } },
        { provide: PartsService, useValue: { findOne: jest.fn(), update: jest.fn() } },
        { provide: SendEmailQueueProvider, useValue: { execute: jest.fn() } },
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
        expect(service).toBeDefined();
    });

  describe('create', () => {

        it('deve validar cliente/veículo, calcular total (serviços + peças) e chamar repo.create com userId', async () => {
            // vínculo ok
            customers.findOne.mockResolvedValue({ id: 10 } as any)
            vehicles.findOne.mockResolvedValue({ id: 20, customerId: 10 } as any)

            // preços em reais, convertToCents = *100 (sem arredondamento aqui)
            svcs.findOne.mockResolvedValue({ id: 1, price: 100 } as any)      // 100 → 10000 cents
            parts.findOne.mockResolvedValue({ id: 2, unitPrice: 20 } as any)  // 20  → 2000  cents

            const dto: any = {
            customerId: 10,
            vehicleId: 20,
            services: [{ serviceId: 1, quantity: 2 }], // 2 * 10000 = 20000
            parts: [{ partId: 2, quantity: 3 }],       // 3 * 2000  = 6000
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

            await expect(service.create(dto, 1)).rejects.toBeInstanceOf(CustomException)
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

        it('deve lançar NotFoundException quando não encontrada', async () => {
        repo.findById.mockResolvedValueOnce(null)

        await expect(service.findById(999)).rejects.toBeInstanceOf(NotFoundException)
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

})
