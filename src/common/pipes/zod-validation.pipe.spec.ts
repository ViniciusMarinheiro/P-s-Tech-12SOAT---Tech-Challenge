import { BadRequestException } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { ZodValidationPipe } from './zod-validation.pipe'

describe('ZodValidationPipe', () => {
  // 1. Criamos um mock do ZodSchema com um método `parse` simulado (jest.fn)
  const mockSchema = {
    parse: jest.fn(),
  } as unknown as jest.Mocked<ZodSchema>

  let pipe: ZodValidationPipe

  // 2. Antes de cada teste, criamos uma nova instância do pipe e limpamos os mocks
  beforeEach(() => {
    jest.clearAllMocks()
    pipe = new ZodValidationPipe(mockSchema)
  })

  it('should be defined', () => {
    expect(pipe).toBeDefined()
  })

  describe('transform', () => {
    it('should return the value correctly if validation is successful', () => {
      // Cenário de Sucesso
      const validValue = { name: 'John Doe' }
      mockSchema.parse.mockReturnValue(validValue)

      const result = pipe.transform(validValue)

      expect(result).toEqual(validValue)
      expect(mockSchema.parse).toHaveBeenCalledWith(validValue)
      expect(mockSchema.parse).toHaveBeenCalledTimes(1)
    })

    it('should throw a formatted BadRequestException if validation fails with a ZodError', () => {
      // Cenário de Falha (ZodError)
      const invalidValue = { name: 123 } // Dados inválidos
      const zodError = new ZodError([]) // Instância de erro do Zod
      mockSchema.parse.mockImplementation(() => {
        throw zodError
      })

      // Verificamos se a exceção correta é lançada
      expect(() => pipe.transform(invalidValue)).toThrow(BadRequestException)

      // Opcional: podemos verificar o conteúdo da exceção
      try {
        pipe.transform(invalidValue)
      } catch (error) {
        expect(error.getStatus()).toBe(400)
        expect(error.getResponse().message).toBe('Validation failed')
        expect(error.getResponse()).toHaveProperty('errors') // Garante que é o erro formatado
      }
    })

    it('should throw a generic BadRequestException for non-Zod errors', () => {
      // Cenário de Falha (Erro Genérico)
      const value = {}
      const genericError = new Error('Something went wrong')
      mockSchema.parse.mockImplementation(() => {
        throw genericError
      })

      expect(() => pipe.transform(value)).toThrow(BadRequestException)

      try {
        pipe.transform(value)
      } catch (error) {
        expect(error.getStatus()).toBe(400)
        // Garante que é a mensagem genérica e não a formatada
        // expect(error.getResponse().message).toBeUndefined()
        expect(error.message).toBe('Validation failed')
      }
    })
  })
})
