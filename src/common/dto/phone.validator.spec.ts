import { PhoneValidator } from './phone.validator'

describe('PhoneValidator', () => {
  let constraint: PhoneValidator

  // Cria uma nova instância do validador antes de cada teste
  beforeEach(() => {
    constraint = new PhoneValidator()
  })

  it('should be defined', () => {
    expect(constraint).toBeDefined()
  })

  // --- Testes para os cenários de SUCESSO ---
  describe('Valid Phones', () => {
    it.each([
      ['11987654321'], // Celular com 9º dígito
      ['1143219876'],  // Fixo de 10 dígitos
      ['(11) 98765-4321'], // Celular com formatação
      ['(48) 3232-9999'],  // Fixo com formatação
    ])('should return TRUE for a valid phone: %s', (phone) => {
      expect(constraint.validate(phone)).toBe(true)
    })
  })

  // --- Testes para os cenários de FALHA ---
  describe('Invalid Phones', () => {
    it.each([
      [null, 'should return FALSE for a null value'],
      [undefined, 'should return FALSE for an undefined value'],
      ['', 'should return FALSE for an empty string'],
      ['123456789', 'should return FALSE for a phone with less than 10 digits'],
      ['123456789012', 'should return FALSE for a phone with more than 11 digits'],
      ['11876543210', 'should return FALSE for an 11-digit number not starting with 9'],
      ['09987654321', 'should return FALSE for an invalid DDD (< 11)'],
      ['telefone', 'should return FALSE for a non-numeric string'],
    ])('should return FALSE for an invalid phone: %s', (phone, description) => {
      // O 'description' no it.each é apenas para clareza na saída do teste
      expect(constraint.validate(phone as string)).toBe(false)
    })
  })

  // --- Teste para a mensagem de erro padrão ---
  describe('defaultMessage', () => {
    it('should return the correct default error message', () => {
      const expectedMessage = 'Telefone ($value) deve ser um número válido brasileiro (DDD + número)'
      expect(constraint.defaultMessage()).toBe(expectedMessage)
    })
  })
})
