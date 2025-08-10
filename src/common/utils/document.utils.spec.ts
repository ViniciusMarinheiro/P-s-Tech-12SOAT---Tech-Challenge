import {
  removeDocumentFormatting,
  detectDocumentType,
  isValidCPF,
  isValidCNPJ,
  isValidDocument,
  DocumentType,
} from './document.utils'

describe('Document Utils', () => {
  // Os testes para estas funções mais simples permanecem os mesmos, pois estão corretos.
  describe('removeDocumentFormatting', () => {
    it('should remove formatting from a CPF', () => {
      expect(removeDocumentFormatting('123.456.789-00')).toBe('12345678900')
    })
    it('should remove formatting from a CNPJ', () => {
      expect(removeDocumentFormatting('12.345.678/0001-99')).toBe(
        '12345678000199',
      )
    })
  })

  describe('detectDocumentType', () => {
    it('should detect CPF for 11-digit documents', () => {
      expect(detectDocumentType('12345678900')).toBe(DocumentType.CPF)
    })
    it('should detect CNPJ for 14-digit documents', () => {
      expect(detectDocumentType('12345678000199')).toBe(DocumentType.CNPJ)
    })
    it('should throw an error for documents with invalid length', () => {
      expect(() => detectDocumentType('12345')).toThrow()
    })
  })

  // --- Testes para isValidCPF com dados verificados ---
  describe('isValidCPF', () => {
    it('should return TRUE for valid CPFs', () => {
      // Números de CPF válidos gerados para teste
      expect(isValidCPF('91212071000')).toBe(true)
      expect(isValidCPF('912.120.710-00')).toBe(true) // Com formatação
    })

    it('should return FALSE for invalid CPFs', () => {
      expect(isValidCPF('12345678900')).toBe(false) // Dígitos verificadores errados
      expect(isValidCPF('11111111111')).toBe(false) // Todos os dígitos iguais
      expect(isValidCPF('123')).toBe(false) // Comprimento incorreto
    })
  })

  // --- Testes para isValidCNPJ com dados verificados ---
  describe('isValidCNPJ', () => {
    it('should return TRUE for valid CNPJs', () => {
      // Números de CNPJ válidos gerados para teste
      expect(isValidCNPJ('47475782000189')).toBe(true)
      expect(isValidCNPJ('47.475.782/0001-89')).toBe(true) // Com formatação
    })

    it('should return FALSE for invalid CNPJs', () => {
      expect(isValidCNPJ('12345678000100')).toBe(false) // Dígitos verificadores errados
      expect(isValidCNPJ('22222222222222')).toBe(false) // Todos os dígitos iguais
      expect(isValidCNPJ('123')).toBe(false) // Comprimento incorreto
    })
  })

  // --- Testes para isValidDocument (a função principal) ---
  describe('isValidDocument', () => {
    it('should return TRUE for any valid document', () => {
      expect(isValidDocument('91212071000')).toBe(true) // CPF Válido
      expect(isValidDocument('47475782000189')).toBe(true) // CNPJ Válido
    })

    it('should return FALSE for any invalid document', () => {
      expect(isValidDocument('11111111111')).toBe(false) // CPF inválido
      expect(isValidDocument('22222222222222')).toBe(false) // CNPJ inválido
      expect(isValidDocument('12345678')).toBe(false) // Comprimento inválido
    })
  })
})