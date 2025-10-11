import { ColumnOptions } from 'typeorm'
import { columnDate } from './column-date.util'

describe('columnDate', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    // Restaura o NODE_ENV original após cada teste
    process.env.NODE_ENV = originalEnv
  })

  describe('funcionalidade básica', () => {
    it('deve retornar um objeto ColumnOptions válido', () => {
      const result = columnDate()
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
      expect(result.type).toBeDefined()
    })

    it('deve incluir todas as opções personalizadas fornecidas', () => {
      const customOptions: ColumnOptions = {
        nullable: false,
        default: 'CURRENT_TIMESTAMP',
        comment: 'Data de criação',
        name: 'created_at'
      }

      const result = columnDate(customOptions)

      expect(result.nullable).toBe(false)
      expect(result.default).toBe('CURRENT_TIMESTAMP')
      expect(result.comment).toBe('Data de criação')
      expect(result.name).toBe('created_at')
    })

    it('deve permitir sobrescrever o tipo via opções (spread operator behavior)', () => {
      const customOptions: ColumnOptions = {
        type: 'date', // Esta irá sobrescrever o tipo padrão
        nullable: true
      }

      const result = columnDate(customOptions)

      // O tipo das opções prevalece por causa do spread operator
      expect(result.type).toBe('date')
      expect(result.nullable).toBe(true)
    })

    it('deve funcionar sem argumentos', () => {
      const result = columnDate()
      
      expect(result.type).toMatch(/datetime|timestamp/)
      expect(Object.keys(result)).toContain('type')
    })

    it('deve funcionar com objeto vazio', () => {
      const result = columnDate({})
      
      expect(result.type).toMatch(/datetime|timestamp/)
      expect(Object.keys(result)).toContain('type')
    })
  })

  describe('comportamento baseado em ambiente', () => {
    it('deve usar datetime quando NODE_ENV é test', () => {
      // O Jest já define NODE_ENV como 'test' por padrão
      if (process.env.NODE_ENV === 'test') {
        const result = columnDate()
        expect(result.type).toBe('datetime')
      }
    })

    it('deve usar o tipo apropriado baseado na lógica interna', () => {
      const result = columnDate()
      
      // Verifica se o tipo retornado é um dos esperados
      expect(['datetime', 'timestamp']).toContain(result.type)
    })
  })

  describe('casos de integração complexos', () => {
    it('deve funcionar com todas as opções do TypeORM', () => {
      const complexOptions: ColumnOptions = {
        name: 'updated_at',
        nullable: false,
        default: 'CURRENT_TIMESTAMP',
        comment: 'Timestamp de atualização',
        precision: 6,
        scale: 0,
        unique: false,
        primary: false,
        select: true,
        insert: true,
        update: false
      }

      const result = columnDate(complexOptions)

      // Verifica se todas as propriedades foram mantidas
      expect(result.name).toBe('updated_at')
      expect(result.nullable).toBe(false)
      expect(result.default).toBe('CURRENT_TIMESTAMP')
      expect(result.comment).toBe('Timestamp de atualização')
      expect(result.precision).toBe(6)
      expect(result.scale).toBe(0)
      expect(result.unique).toBe(false)
      expect(result.primary).toBe(false)
      expect(result.select).toBe(true)
      expect(result.insert).toBe(true)
      expect(result.update).toBe(false)
      
      // E que o tipo foi definido pela função
      expect(['datetime', 'timestamp']).toContain(result.type)
    })

    it('deve preservar propriedades booleanas corretamente', () => {
      const booleanOptions: ColumnOptions = {
        nullable: true,
        unique: true,
        primary: false,
        select: false
      }

      const result = columnDate(booleanOptions)

      expect(result.nullable).toBe(true)
      expect(result.unique).toBe(true)
      expect(result.primary).toBe(false)
      expect(result.select).toBe(false)
    })

    it('deve preservar valores null/undefined corretamente', () => {
      const nullOptions: ColumnOptions = {
        default: null,
        comment: undefined
      }

      const result = columnDate(nullOptions)

      expect(result.default).toBe(null)
      expect(result.comment).toBeUndefined()
    })
  })

  describe('edge cases', () => {
    it('deve lidar com propriedades com valores falsy', () => {
      const falsyOptions: ColumnOptions = {
        precision: 0,
        scale: 0,
        name: ''
      }

      const result = columnDate(falsyOptions)

      expect(result.precision).toBe(0)
      expect(result.scale).toBe(0)
      expect(result.name).toBe('')
    })

    it('deve manter a estrutura correta do objeto (spread operator)', () => {
      const options: ColumnOptions = {
        name: 'test',
        nullable: true,
        type: 'varchar' // Esta irá sobrescrever o tipo padrão
      }

      const result = columnDate(options)

      // As opções fornecidas devem sobrescrever os valores padrão
      expect(result.type).toBe('varchar')
      expect(result.name).toBe('test')
      expect(result.nullable).toBe(true)
    })
  })
})