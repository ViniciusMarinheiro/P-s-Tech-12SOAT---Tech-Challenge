import { ServiceMapper } from './service.mapper'
import { ServiceDomain } from '../../domain/entities/service.entity'

// Mock da função convertToMoney
jest.mock('@/common/utils/convert-to-money', () => ({
  convertToMoney: jest.fn((value: number) => value / 100)
}))

describe('ServiceMapper', () => {
  describe('toDomain', () => {
    it('deve mapear corretamente um serviço de troca de óleo para domínio', () => {
      const ormService = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Troca de óleo',
        description: 'Troca completa do óleo do motor com filtro',
        price: 8000, // Em centavos (R$ 80,00)
        createdAt: new Date('2024-01-01T10:00:00Z'),
      } as any

      const result = ServiceMapper.toDomain(ormService)

      expect(result).toBeInstanceOf(ServiceDomain)
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.name).toBe('Troca de óleo')
      expect(result.description).toBe('Troca completa do óleo do motor com filtro')
      expect(result.price).toBe(80) // convertToMoney aplicado (8000/100)
      expect(result.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'))
    })

    it('deve mapear corretamente um serviço de alinhamento para domínio', () => {
      const ormService = {
        id: '456e7890-e12c-34d5-b678-901234567890',
        name: 'Alinhamento e balanceamento',
        description: 'Alinhamento de direção e balanceamento das rodas',
        price: 12000, // Em centavos (R$ 120,00)
        createdAt: new Date('2023-06-15T14:30:00Z'),
      } as any

      const result = ServiceMapper.toDomain(ormService)

      expect(result).toBeInstanceOf(ServiceDomain)
      expect(result.id).toBe('456e7890-e12c-34d5-b678-901234567890')
      expect(result.name).toBe('Alinhamento e balanceamento')
      expect(result.description).toBe('Alinhamento de direção e balanceamento das rodas')
      expect(result.price).toBe(120) // convertToMoney aplicado (12000/100)
      expect(result.createdAt).toEqual(new Date('2023-06-15T14:30:00Z'))
    })

    it('deve mapear corretamente um serviço de revisão completa para domínio', () => {
      const ormService = {
        id: '789e0123-e45f-67g8-h901-234567890abc',
        name: 'Revisão completa',
        description: 'Revisão geral de 10.000 km com checklist completo',
        price: 25000, // Em centavos (R$ 250,00)
        createdAt: new Date('2022-12-01T09:15:00Z'),
      } as any

      const result = ServiceMapper.toDomain(ormService)

      expect(result.name).toBe('Revisão completa')
      expect(result.description).toBe('Revisão geral de 10.000 km com checklist completo')
      expect(result.price).toBe(250) // convertToMoney aplicado (25000/100)
      expect(result.createdAt).toEqual(new Date('2022-12-01T09:15:00Z'))
    })

    it('deve mapear serviço com preço zero corretamente', () => {
      const ormService = {
        id: 'free-service-id',
        name: 'Diagnóstico gratuito',
        description: 'Diagnóstico inicial sem custo',
        price: 0, // Serviço gratuito
        createdAt: new Date('2024-05-20T12:00:00Z'),
      } as any

      const result = ServiceMapper.toDomain(ormService)

      expect(result.name).toBe('Diagnóstico gratuito')
      expect(result.description).toBe('Diagnóstico inicial sem custo')
      expect(result.price).toBe(0) // convertToMoney aplicado (0/100)
    })

    it('deve preservar todas as propriedades durante o mapeamento', () => {
      const ormService = {
        id: 'test-service-id',
        name: 'Serviço de teste',
        description: 'Descrição do serviço de teste',
        price: 5500, // Em centavos (R$ 55,00)
        createdAt: new Date('2024-03-10T16:45:00Z'),
      } as any

      const result = ServiceMapper.toDomain(ormService)

      // Verifica se todas as propriedades foram mapeadas corretamente
      expect(result.id).toBe('test-service-id')
      expect(result.name).toBe('Serviço de teste')
      expect(result.description).toBe('Descrição do serviço de teste')
      expect(result.price).toBe(55) // convertToMoney aplicado (5500/100)
      expect(result.createdAt).toEqual(new Date('2024-03-10T16:45:00Z'))
    })

    it('deve mapear serviço com descrição longa corretamente', () => {
      const longDescription = 'Este é um serviço muito detalhado que inclui múltiplas etapas: verificação inicial, diagnóstico completo, execução do serviço principal, testes finais e entrega com relatório detalhado.'

      const ormService = {
        id: 'detailed-service-id',
        name: 'Serviço Premium',
        description: longDescription,
        price: 35000, // Em centavos (R$ 350,00)
        createdAt: new Date('2023-08-22T11:30:00Z'),
      } as any

      const result = ServiceMapper.toDomain(ormService)

      expect(result.name).toBe('Serviço Premium')
      expect(result.description).toBe(longDescription)
      expect(result.price).toBe(350) // convertToMoney aplicado (35000/100)
    })

    it('deve aplicar convertToMoney corretamente para diferentes valores', () => {
      const ormService = {
        id: 'price-test-id',
        name: 'Teste de preço',
        description: 'Serviço para testar conversão de preço',
        price: 9999, // Em centavos (R$ 99,99)
        createdAt: new Date('2024-01-15T08:00:00Z'),
      } as any

      const result = ServiceMapper.toDomain(ormService)

      expect(result.price).toBe(99.99) // convertToMoney aplicado (9999/100)
      expect(result.name).toBe('Teste de preço')
      expect(result.description).toBe('Serviço para testar conversão de preço')
    })
  })
})