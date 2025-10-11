import { VehicleMapper } from './vehicle.mapper'
import { VehicleDomain } from '../../domain/entities/vehicle.entity'

describe('VehicleMapper', () => {
  describe('toDomain', () => {
    it('deve mapear corretamente uma entidade ORM para domínio', () => {
      const ormVehicle = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        plate: 'ABC-1234',
        brand: 'Honda',
        model: 'Civic',
        year: 2022,
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      } as any

      const result = VehicleMapper.toDomain(ormVehicle)

      expect(result).toBeInstanceOf(VehicleDomain)
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.customerId).toBe('123e4567-e89b-12d3-a456-426614174001')
      expect(result.plate).toBe('ABC-1234')
      expect(result.brand).toBe('Honda')
      expect(result.model).toBe('Civic')
      expect(result.year).toBe(2022)
      expect(result.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'))
      expect(result.updatedAt).toEqual(new Date('2024-01-01T11:00:00Z'))
    })

    it('deve mapear vehicle com ano diferente', () => {
      const ormVehicle = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        plate: 'XYZ-9876',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        createdAt: new Date('2023-05-15T08:30:00Z'),
        updatedAt: new Date('2023-05-15T09:00:00Z'),
      } as any

      const result = VehicleMapper.toDomain(ormVehicle)

      expect(result.plate).toBe('XYZ-9876')
      expect(result.brand).toBe('Toyota')
      expect(result.model).toBe('Corolla')
      expect(result.year).toBe(2020)
    })

    it('deve mapear todas as propriedades corretamente', () => {
      const ormVehicle = {
        id: 'test-id',
        customerId: 'test-customer-id',
        plate: 'TEST-001',
        brand: 'Ford',
        model: 'Focus',
        year: 2019,
        createdAt: new Date('2022-12-01T00:00:00Z'),
        updatedAt: new Date('2022-12-01T00:00:00Z'),
      } as any

      const result = VehicleMapper.toDomain(ormVehicle)

      // Verifica se todas as propriedades foram mapeadas
      expect(result.id).toBe('test-id')
      expect(result.customerId).toBe('test-customer-id')
      expect(result.plate).toBe('TEST-001')
      expect(result.brand).toBe('Ford')
      expect(result.model).toBe('Focus')
      expect(result.year).toBe(2019)
      expect(result.createdAt).toEqual(new Date('2022-12-01T00:00:00Z'))
      expect(result.updatedAt).toEqual(new Date('2022-12-01T00:00:00Z'))
    })
  })
})