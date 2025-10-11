import { CustomerDomain } from '../../domain/entities/customer.entity'
import { CustomerMapper } from './customer.mapper'

describe('CustomerMapper', () => {
  describe('toDomain', () => {
    it('should map ORM customer entity to domain entity', () => {
      const ormCustomer = {
        id: 'customer-id-1',
        name: 'João Silva',
        documentNumber: '123.456.789-00',
        phone: '(11) 99999-9999',
        email: 'joao.silva@email.com',
        createdAt: new Date('2024-01-15T10:30:00Z'),
        updatedAt: new Date('2024-01-15T10:30:00Z'),
        vehicles: [],
        workOrders: [],
      } as any

      const result = CustomerMapper.toDomain(ormCustomer)

      expect(result).toBeInstanceOf(CustomerDomain)
      expect(result.id).toBe('customer-id-1')
      expect(result.name).toBe('João Silva')
      expect(result.documentNumber).toBe('123.456.789-00')
      expect(result.phone).toBe('(11) 99999-9999')
      expect(result.email).toBe('joao.silva@email.com')
      expect(result.createdAt).toEqual(new Date('2024-01-15T10:30:00Z'))
      expect(result.updatedAt).toEqual(new Date('2024-01-15T10:30:00Z'))
    })

    it('should map customer with CNPJ document number', () => {
      const ormCustomer = {
        id: 'customer-id-2',
        name: 'Empresa XYZ Ltda',
        documentNumber: '12.345.678/0001-90',
        phone: '(11) 3333-4444',
        email: 'contato@empresaxyz.com.br',
        createdAt: new Date('2024-02-20T14:45:00Z'),
        updatedAt: new Date('2024-02-22T09:15:00Z'),
        vehicles: [],
        workOrders: [],
      } as any

      const result = CustomerMapper.toDomain(ormCustomer)

      expect(result).toBeInstanceOf(CustomerDomain)
      expect(result.id).toBe('customer-id-2')
      expect(result.name).toBe('Empresa XYZ Ltda')
      expect(result.documentNumber).toBe('12.345.678/0001-90')
      expect(result.phone).toBe('(11) 3333-4444')
      expect(result.email).toBe('contato@empresaxyz.com.br')
    })

    it('should map customer with special characters in name', () => {
      const ormCustomer = {
        id: 'customer-id-3',
        name: 'José da Silva & Filhos Cia. Ltda.',
        documentNumber: '987.654.321-11',
        phone: '(21) 98765-4321',
        email: 'jose.silva@exemplo.com',
        createdAt: new Date('2024-03-10T08:00:00Z'),
        updatedAt: new Date('2024-03-10T08:00:00Z'),
        vehicles: [],
        workOrders: [],
      } as any

      const result = CustomerMapper.toDomain(ormCustomer)

      expect(result).toBeInstanceOf(CustomerDomain)
      expect(result.name).toBe('José da Silva & Filhos Cia. Ltda.')
      expect(result.documentNumber).toBe('987.654.321-11')
      expect(result.email).toBe('jose.silva@exemplo.com')
    })

    it('should map customer with different phone format', () => {
      const ormCustomer = {
        id: 'customer-id-4',
        name: 'Maria Santos',
        documentNumber: '111.222.333-44',
        phone: '+55 11 94567-8901',
        email: 'maria.santos@gmail.com',
        createdAt: new Date('2024-04-05T16:20:00Z'),
        updatedAt: new Date('2024-04-07T12:30:00Z'),
        vehicles: [],
        workOrders: [],
      } as any

      const result = CustomerMapper.toDomain(ormCustomer)

      expect(result).toBeInstanceOf(CustomerDomain)
      expect(result.phone).toBe('+55 11 94567-8901')
      expect(result.createdAt).toEqual(new Date('2024-04-05T16:20:00Z'))
      expect(result.updatedAt).toEqual(new Date('2024-04-07T12:30:00Z'))
    })

    it('should map customer with uppercase email', () => {
      const ormCustomer = {
        id: 'customer-id-5',
        name: 'Carlos Oliveira',
        documentNumber: '555.666.777-88',
        phone: '(47) 99876-5432',
        email: 'CARLOS.OLIVEIRA@HOTMAIL.COM',
        createdAt: new Date('2024-05-15T11:45:00Z'),
        updatedAt: new Date('2024-05-15T11:45:00Z'),
        vehicles: [],
        workOrders: [],
      } as any

      const result = CustomerMapper.toDomain(ormCustomer)

      expect(result).toBeInstanceOf(CustomerDomain)
      expect(result.email).toBe('CARLOS.OLIVEIRA@HOTMAIL.COM')
    })

    it('should preserve all properties when mapping', () => {
      const testDate = new Date('2024-06-01T00:00:00Z')
      const ormCustomer = {
        id: 'preserve-test-id',
        name: 'Ana Costa',
        documentNumber: '999.888.777-66',
        phone: '(85) 91234-5678',
        email: 'ana.costa@yahoo.com.br',
        createdAt: testDate,
        updatedAt: testDate,
        vehicles: [],
        workOrders: [],
      } as any

      const result = CustomerMapper.toDomain(ormCustomer)

      expect(Object.keys(result)).toContain('id')
      expect(Object.keys(result)).toContain('name')
      expect(Object.keys(result)).toContain('documentNumber')
      expect(Object.keys(result)).toContain('phone')
      expect(Object.keys(result)).toContain('email')
      expect(Object.keys(result)).toContain('createdAt')
      expect(Object.keys(result)).toContain('updatedAt')
    })
  })
})