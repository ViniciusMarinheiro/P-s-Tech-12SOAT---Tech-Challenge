import { DocumentValidator } from './document.validator'
// Importamos as funções que vamos mockar
import {
  isValidDocument,
  removeDocumentFormatting,
} from '../utils/document.utils'

// No topo do arquivo, instruímos o Jest a substituir o módulo real por um mock
jest.mock('../utils/document.utils', () => ({
  // Cada função exportada se torna uma função de mock (jest.fn)
  isValidDocument: jest.fn(),
  removeDocumentFormatting: jest.fn(),
}))

describe('DocumentValidator', () => {
  let validator: DocumentValidator

  // Criamos variáveis tipadas para nossos mocks para facilitar o uso
  const mockedIsValidDocument = isValidDocument as jest.Mock
  const mockedRemoveFormatting = removeDocumentFormatting as jest.Mock

  beforeEach(() => {
    // Cria uma nova instância e limpa os mocks antes de cada teste
    validator = new DocumentValidator()
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(validator).toBeDefined()
  })

  describe('validate', () => {
    it('should return FALSE if the document is null or undefined', () => {
      // Testa a primeira verificação de `if (!document)`
      expect(validator.validate(null as any)).toBe(false)
      expect(validator.validate(undefined as any)).toBe(false)
      // Garante que as funções utilitárias nem foram chamadas
      expect(mockedIsValidDocument).not.toHaveBeenCalled()
    })

    it('should call the utils and return TRUE for a valid document', () => {
      // --- Arrange: Preparamos o cenário ---
      const dirtyDocument = '123.456'
      const cleanDocument = '123456'
      // Dizemos aos mocks como se comportar
      mockedRemoveFormatting.mockReturnValue(cleanDocument)
      mockedIsValidDocument.mockReturnValue(true)

      // --- Act: Executamos o método ---
      const result = validator.validate(dirtyDocument)

      // --- Assert: Verificamos o resultado e as chamadas ---
      expect(result).toBe(true)
      expect(mockedRemoveFormatting).toHaveBeenCalledWith(dirtyDocument)
      expect(mockedIsValidDocument).toHaveBeenCalledWith(cleanDocument)
    })

    it('should call the utils and return FALSE for an invalid document', () => {
      // --- Arrange ---
      const dirtyDocument = 'invalid-doc'
      const cleanDocument = 'invaliddoc'
      mockedRemoveFormatting.mockReturnValue(cleanDocument)
      mockedIsValidDocument.mockReturnValue(false)

      // --- Act ---
      const result = validator.validate(dirtyDocument)

      // --- Assert ---
      expect(result).toBe(false)
      expect(mockedRemoveFormatting).toHaveBeenCalledWith(dirtyDocument)
      expect(mockedIsValidDocument).toHaveBeenCalledWith(cleanDocument)
    })
  })

  describe('defaultMessage', () => {
    it('should return the correct default error message', () => {
      const expectedMessage =
        'Documento deve ser um CPF válido (11 dígitos) ou CNPJ válido (14 dígitos)'
      expect(validator.defaultMessage()).toBe(expectedMessage)
    })
  })
})
