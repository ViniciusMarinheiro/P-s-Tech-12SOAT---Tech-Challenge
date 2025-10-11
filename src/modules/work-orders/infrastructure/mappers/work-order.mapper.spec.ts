import { WorkOrderDomainMapper } from './work-order.mapper'
import { WorkOrder as OrmWorkOrder } from '../database/work-order.entity'
import { WorkOrderPart as OrmWorkOrderPart } from '../database/work-order-part.entity'
import { WorkOrderService as OrmWorkOrderService } from '../database/work-order-service.entity'
import { WorkOrder } from '../../domain/entities/work-order.entity'
import { WorkOrderPart } from '../../domain/entities/work-order-part.entity'
import { WorkOrderService } from '../../domain/entities/work-order-service.entity'

// Mock da função convertToMoney
jest.mock('@/common/utils/convert-to-money', () => ({
  convertToMoney: jest.fn((value: number) => value / 100)
}))

describe('WorkOrderDomainMapper', () => {
  describe('toDomain', () => {
    it('deve mapear corretamente uma entidade ORM para domínio', () => {
      const ormWorkOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        vehicleId: '123e4567-e89b-12d3-a456-426614174002',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        hashView: 'abc123def456',
        protocol: 'WO-2024-001',
        status: 'PENDING',
        totalAmount: 50000, // Em centavos
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
        startedAt: new Date('2024-01-01T12:00:00Z'),
        finishedAt: new Date('2024-01-01T15:00:00Z'),
      } as any

      const result = WorkOrderDomainMapper.toDomain(ormWorkOrder)

      expect(result).toBeInstanceOf(WorkOrder)
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.customerId).toBe('123e4567-e89b-12d3-a456-426614174001')
      expect(result.vehicleId).toBe('123e4567-e89b-12d3-a456-426614174002')
      expect(result.userId).toBe('123e4567-e89b-12d3-a456-426614174003')
      expect(result.hashView).toBe('abc123def456')
      expect(result.protocol).toBe('WO-2024-001')
      expect(result.status).toBe('PENDING')
      expect(result.totalAmount).toBe(500) // convertToMoney aplicado
      expect(result.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'))
      expect(result.updatedAt).toEqual(new Date('2024-01-01T11:00:00Z'))
      expect(result.startedAt).toEqual(new Date('2024-01-01T12:00:00Z'))
      expect(result.finishedAt).toEqual(new Date('2024-01-01T15:00:00Z'))
    })

    it('deve lidar com datas nulas', () => {
      const ormWorkOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        vehicleId: '123e4567-e89b-12d3-a456-426614174002',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        hashView: 'abc123def456',
        protocol: 'WO-2024-001',
        status: 'DRAFT',
        totalAmount: 0,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
        startedAt: null,
        finishedAt: null,
      } as any

      const result = WorkOrderDomainMapper.toDomain(ormWorkOrder)

      expect(result.startedAt).toBeNull()
      expect(result.finishedAt).toBeNull()
      expect(result.totalAmount).toBe(0)
    })

    it('deve lidar com valores zerados', () => {
      const ormWorkOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        vehicleId: '123e4567-e89b-12d3-a456-426614174002',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        hashView: '',
        protocol: '',
        status: 'DRAFT',
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        startedAt: null,
        finishedAt: null,
      } as any

      const result = WorkOrderDomainMapper.toDomain(ormWorkOrder)

      expect(result.hashView).toBe('')
      expect(result.protocol).toBe('')
      expect(result.totalAmount).toBe(0)
    })
  })

  describe('withRelations', () => {
    it('deve mapear work order com todas as relações completas', () => {
      const ormWorkOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        vehicleId: '123e4567-e89b-12d3-a456-426614174002',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        hashView: 'abc123def456',
        protocol: 'WO-2024-001',
        status: 'IN_PROGRESS',
        totalAmount: 100000,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
        startedAt: new Date('2024-01-01T12:00:00Z'),
        finishedAt: null,
        customer: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao@example.com',
        },
        user: {
          id: '123e4567-e89b-12d3-a456-426614174003',
          name: 'Técnico José',
          email: 'jose@example.com',
        },
        vehicle: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          plate: 'ABC-1234',
          model: 'Civic',
          brand: 'Honda',
        },
        workOrderServices: [
          {
            id: '123e4567-e89b-12d3-a456-426614174010',
            serviceId: '123e4567-e89b-12d3-a456-426614174011',
            quantity: 1,
            totalPrice: 50000,
            service: {
              name: 'Troca de óleo',
              price: 50000,
            },
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174012',
            serviceId: '123e4567-e89b-12d3-a456-426614174013',
            quantity: 2,
            totalPrice: 30000,
            service: {
              name: 'Alinhamento',
              price: 15000,
            },
          },
        ],
        workOrderParts: [
          {
            id: '123e4567-e89b-12d3-a456-426614174020',
            partId: '123e4567-e89b-12d3-a456-426614174021',
            quantity: 1,
            totalPrice: 15000,
            part: {
              name: 'Filtro de óleo',
              unitPrice: 15000,
            },
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174022',
            partId: '123e4567-e89b-12d3-a456-426614174023',
            quantity: 4,
            totalPrice: 8000,
            part: {
              name: 'Parafuso',
              unitPrice: 2000,
            },
          },
        ],
      } as any

      const result = WorkOrderDomainMapper.withRelations(ormWorkOrder)

      // Verifica a work order principal
      expect(result).toBeInstanceOf(WorkOrder)
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.status).toBe('IN_PROGRESS')
      expect(result.totalAmount).toBe(1000) // convertToMoney aplicado

      // Verifica customer
      expect(result.customer).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'João Silva',
        email: 'joao@example.com',
      })

      // Verifica user
      expect(result.user).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174003',
        name: 'Técnico José',
        email: 'jose@example.com',
      })

      // Verifica vehicle
      expect(result.vehicle).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174002',
        plate: 'ABC-1234',
        model: 'Civic',
        brand: 'Honda',
      })

      // Verifica services
      expect(result.services).toBeDefined()
      expect(result.services).toHaveLength(2)
      expect(result.services![0]).toBeInstanceOf(WorkOrderService)
      expect(result.services![0].id).toBe('123e4567-e89b-12d3-a456-426614174010')
      expect(result.services![0].serviceName).toBe('Troca de óleo')
      expect(result.services![0].quantity).toBe(1)
      expect(result.services![0].unitPrice).toBe(500) // convertToMoney aplicado
      expect(result.services![0].totalPrice).toBe(500) // convertToMoney aplicado

      expect(result.services![1].serviceName).toBe('Alinhamento')
      expect(result.services![1].quantity).toBe(2)

      // Verifica parts
      expect(result.parts).toBeDefined()
      expect(result.parts).toHaveLength(2)
      expect(result.parts![0]).toBeInstanceOf(WorkOrderPart)
      expect(result.parts![0].id).toBe('123e4567-e89b-12d3-a456-426614174020')
      expect(result.parts![0].partName).toBe('Filtro de óleo')
      expect(result.parts![0].quantity).toBe(1)
      expect(result.parts![0].unitPrice).toBe(150) // convertToMoney aplicado
      expect(result.parts![0].totalPrice).toBe(150) // convertToMoney aplicado

      expect(result.parts![1].partName).toBe('Parafuso')
      expect(result.parts![1].quantity).toBe(4)
    })

    it('deve lidar com arrays vazios de services e parts', () => {
      const ormWorkOrder: OrmWorkOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        vehicleId: '123e4567-e89b-12d3-a456-426614174002',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        hashView: 'abc123def456',
        protocol: 'WO-2024-001',
        status: 'DRAFT',
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        startedAt: null,
        finishedAt: null,
        customer: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao@example.com',
        },
        user: {
          id: '123e4567-e89b-12d3-a456-426614174003',
          name: 'Técnico José',
          email: 'jose@example.com',
        },
        vehicle: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          plate: 'ABC-1234',
          model: 'Civic',
          brand: 'Honda',
        },
        workOrderServices: [],
        workOrderParts: [],
      } as any

      const result = WorkOrderDomainMapper.withRelations(ormWorkOrder)

      expect(result.services).toEqual([])
      expect(result.parts).toEqual([])
    })

    it('deve lidar com services e parts undefined/null', () => {
      const ormWorkOrder: OrmWorkOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        vehicleId: '123e4567-e89b-12d3-a456-426614174002',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        hashView: 'abc123def456',
        protocol: 'WO-2024-001',
        status: 'DRAFT',
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        startedAt: null,
        finishedAt: null,
        customer: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao@example.com',
        },
        user: {
          id: '123e4567-e89b-12d3-a456-426614174003',
          name: 'Técnico José',
          email: 'jose@example.com',
        },
        vehicle: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          plate: 'ABC-1234',
          model: 'Civic',
          brand: 'Honda',
        },
        workOrderServices: undefined,
        workOrderParts: null,
      } as any

      const result = WorkOrderDomainMapper.withRelations(ormWorkOrder)

      expect(result.services).toEqual([])
      expect(result.parts).toEqual([])
    })

    it('deve lidar com services sem relação service preenchida', () => {
      const ormWorkOrder: OrmWorkOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        vehicleId: '123e4567-e89b-12d3-a456-426614174002',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        hashView: 'abc123def456',
        protocol: 'WO-2024-001',
        status: 'DRAFT',
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        startedAt: null,
        finishedAt: null,
        customer: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao@example.com',
        },
        user: {
          id: '123e4567-e89b-12d3-a456-426614174003',
          name: 'Técnico José',
          email: 'jose@example.com',
        },
        vehicle: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          plate: 'ABC-1234',
          model: 'Civic',
          brand: 'Honda',
        },
        workOrderServices: [
          {
            id: '123e4567-e89b-12d3-a456-426614174010',
            serviceId: '123e4567-e89b-12d3-a456-426614174011',
            quantity: 1,
            totalPrice: 50000,
            service: null, // Sem relação carregada
          },
        ],
        workOrderParts: [
          {
            id: '123e4567-e89b-12d3-a456-426614174020',
            partId: '123e4567-e89b-12d3-a456-426614174021',
            quantity: 1,
            totalPrice: 15000,
            part: undefined, // Sem relação carregada
          },
        ],
      } as any

      const result = WorkOrderDomainMapper.withRelations(ormWorkOrder)

      // Deve usar valores padrão quando relações não estão carregadas
      expect(result.services![0].serviceName).toBe('')
      expect(result.services![0].unitPrice).toBe(0) // convertToMoney(0)
      
      expect(result.parts![0].partName).toBe('')
      expect(result.parts![0].unitPrice).toBe(0) // convertToMoney(0)
    })

    it('deve lidar com propriedades undefined em service e part', () => {
      const ormWorkOrder: OrmWorkOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        vehicleId: '123e4567-e89b-12d3-a456-426614174002',
        userId: '123e4567-e89b-12d3-a456-426614174003',
        hashView: 'abc123def456',
        protocol: 'WO-2024-001',
        status: 'DRAFT',
        totalAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        startedAt: null,
        finishedAt: null,
        customer: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao@example.com',
        },
        user: {
          id: '123e4567-e89b-12d3-a456-426614174003',
          name: 'Técnico José',
          email: 'jose@example.com',
        },
        vehicle: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          plate: 'ABC-1234',
          model: 'Civic',
          brand: 'Honda',
        },
        workOrderServices: [
          {
            id: '123e4567-e89b-12d3-a456-426614174010',
            serviceId: '123e4567-e89b-12d3-a456-426614174011',
            quantity: 1,
            totalPrice: 50000,
            service: {
              name: undefined,
              price: undefined,
            },
          },
        ],
        workOrderParts: [
          {
            id: '123e4567-e89b-12d3-a456-426614174020',
            partId: '123e4567-e89b-12d3-a456-426614174021',
            quantity: 1,
            totalPrice: 15000,
            part: {
              name: undefined,
              unitPrice: undefined,
            },
          },
        ],
      } as any

      const result = WorkOrderDomainMapper.withRelations(ormWorkOrder)

      // Deve usar valores padrão quando propriedades são undefined
      expect(result.services![0].serviceName).toBe('')
      expect(result.services![0].unitPrice).toBe(0) // convertToMoney(0)
      
      expect(result.parts![0].partName).toBe('')
      expect(result.parts![0].unitPrice).toBe(0) // convertToMoney(0)
    })
  })
})