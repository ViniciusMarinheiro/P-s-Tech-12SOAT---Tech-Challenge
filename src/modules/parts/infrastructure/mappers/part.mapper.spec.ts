import { PartMapper } from './part.mapper'
import { PartDomain } from '../../domain/entities/part.entity'

// Mock da função convertToMoney
jest.mock('@/common/utils/convert-to-money', () => ({
  convertToMoney: jest.fn((value: number) => value / 100)
}))

describe('PartMapper', () => {
  describe('toDomain', () => {
    it('deve mapear corretamente um filtro de óleo para domínio', () => {
      const ormPart = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Filtro de óleo',
        description: 'Filtro de óleo para motor 1.0 a 2.0',
        stock: 25,
        unitPrice: 2500, // Em centavos (R$ 25,00)
        createdAt: new Date('2024-01-01T10:00:00Z'),
      } as any

      const result = PartMapper.toDomain(ormPart)

      expect(result).toBeInstanceOf(PartDomain)
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.name).toBe('Filtro de óleo')
      expect(result.description).toBe('Filtro de óleo para motor 1.0 a 2.0')
      expect(result.stock).toBe(25)
      expect(result.unitPrice).toBe(25) // convertToMoney aplicado (2500/100)
      expect(result.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'))
    })

    it('deve mapear corretamente um pneu para domínio', () => {
      const ormPart = {
        id: '456e7890-e12c-34d5-b678-901234567890',
        name: 'Pneu Aro 15',
        description: 'Pneu radial 195/65 R15 para carros de passeio',
        stock: 8,
        unitPrice: 45000, // Em centavos (R$ 450,00)
        createdAt: new Date('2023-06-15T14:30:00Z'),
      } as any

      const result = PartMapper.toDomain(ormPart)

      expect(result).toBeInstanceOf(PartDomain)
      expect(result.id).toBe('456e7890-e12c-34d5-b678-901234567890')
      expect(result.name).toBe('Pneu Aro 15')
      expect(result.description).toBe('Pneu radial 195/65 R15 para carros de passeio')
      expect(result.stock).toBe(8)
      expect(result.unitPrice).toBe(450) // convertToMoney aplicado (45000/100)
      expect(result.createdAt).toEqual(new Date('2023-06-15T14:30:00Z'))
    })

    it('deve mapear corretamente uma bateria para domínio', () => {
      const ormPart = {
        id: '789e0123-e45f-67g8-h901-234567890abc',
        name: 'Bateria 60Ah',
        description: 'Bateria automotiva 12V 60Ah livre de manutenção',
        stock: 12,
        unitPrice: 35000, // Em centavos (R$ 350,00)
        createdAt: new Date('2022-12-01T09:15:00Z'),
      } as any

      const result = PartMapper.toDomain(ormPart)

      expect(result.name).toBe('Bateria 60Ah')
      expect(result.description).toBe('Bateria automotiva 12V 60Ah livre de manutenção')
      expect(result.stock).toBe(12)
      expect(result.unitPrice).toBe(350) // convertToMoney aplicado (35000/100)
      expect(result.createdAt).toEqual(new Date('2022-12-01T09:15:00Z'))
    })

    it('deve mapear peça com estoque zero corretamente', () => {
      const ormPart = {
        id: 'out-of-stock-part-id',
        name: 'Parafuso especial',
        description: 'Parafuso M8x25 para fixação do motor',
        stock: 0, // Sem estoque
        unitPrice: 150, // Em centavos (R$ 1,50)
        createdAt: new Date('2024-05-20T12:00:00Z'),
      } as any

      const result = PartMapper.toDomain(ormPart)

      expect(result.name).toBe('Parafuso especial')
      expect(result.description).toBe('Parafuso M8x25 para fixação do motor')
      expect(result.stock).toBe(0)
      expect(result.unitPrice).toBe(1.5) // convertToMoney aplicado (150/100)
    })

    it('deve mapear peça com estoque alto corretamente', () => {
      const ormPart = {
        id: 'high-stock-part-id',
        name: 'Parafuso comum',
        description: 'Parafuso M6x20 uso geral',
        stock: 500, // Estoque alto
        unitPrice: 50, // Em centavos (R$ 0,50)
        createdAt: new Date('2023-03-10T08:45:00Z'),
      } as any

      const result = PartMapper.toDomain(ormPart)

      expect(result.name).toBe('Parafuso comum')
      expect(result.stock).toBe(500)
      expect(result.unitPrice).toBe(0.5) // convertToMoney aplicado (50/100)
    })

    it('deve preservar todas as propriedades durante o mapeamento', () => {
      const ormPart = {
        id: 'test-part-id',
        name: 'Peça de teste',
        description: 'Descrição da peça de teste',
        stock: 15,
        unitPrice: 7850, // Em centavos (R$ 78,50)
        createdAt: new Date('2024-03-10T16:45:00Z'),
      } as any

      const result = PartMapper.toDomain(ormPart)

      // Verifica se todas as propriedades foram mapeadas corretamente
      expect(result.id).toBe('test-part-id')
      expect(result.name).toBe('Peça de teste')
      expect(result.description).toBe('Descrição da peça de teste')
      expect(result.stock).toBe(15)
      expect(result.unitPrice).toBe(78.5) // convertToMoney aplicado (7850/100)
      expect(result.createdAt).toEqual(new Date('2024-03-10T16:45:00Z'))
    })

    it('deve mapear peça com descrição técnica detalhada', () => {
      const technicalDescription = 'Filtro de ar esportivo de alto fluxo, material algodão reutilizável, dimensões 250x200x50mm, compatível com motores 1.4 TSI, 1.6 MPI e 2.0 TSI'

      const ormPart = {
        id: 'technical-part-id',
        name: 'Filtro de ar esportivo',
        description: technicalDescription,
        stock: 6,
        unitPrice: 18000, // Em centavos (R$ 180,00)
        createdAt: new Date('2023-08-22T11:30:00Z'),
      } as any

      const result = PartMapper.toDomain(ormPart)

      expect(result.name).toBe('Filtro de ar esportivo')
      expect(result.description).toBe(technicalDescription)
      expect(result.stock).toBe(6)
      expect(result.unitPrice).toBe(180) // convertToMoney aplicado (18000/100)
    })

    it('deve aplicar convertToMoney corretamente para diferentes valores', () => {
      const ormPart = {
        id: 'price-test-id',
        name: 'Teste de preço',
        description: 'Peça para testar conversão de preço',
        stock: 3,
        unitPrice: 12345, // Em centavos (R$ 123,45)
        createdAt: new Date('2024-01-15T08:00:00Z'),
      } as any

      const result = PartMapper.toDomain(ormPart)

      expect(result.unitPrice).toBe(123.45) // convertToMoney aplicado (12345/100)
      expect(result.name).toBe('Teste de preço')
      expect(result.stock).toBe(3)
    })
  })
})