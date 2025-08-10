import { convertToMoney } from './convert-to-money'

describe('convertToMoney', () => {
  it('should convert an integer in cents to a decimal money value', () => {
    // Cenário com um valor típico
    const centsValue = 1999
    const expectedMoney = 19.99
    expect(convertToMoney(centsValue)).toBe(expectedMoney)
  })

  it('should convert a value that results in a whole number', () => {
    // Cenário que resulta em um inteiro
    const centsValue = 2500
    const expectedMoney = 25
    expect(convertToMoney(centsValue)).toBe(expectedMoney)
  })

  it('should handle zero correctly', () => {
    // Cenário com zero
    const centsValue = 0
    const expectedMoney = 0
    expect(convertToMoney(centsValue)).toBe(expectedMoney)
  })

  it('should handle values less than 100 cents correctly', () => {
    // Cenário com valor menor que R$ 1,00
    const centsValue = 50
    const expectedMoney = 0.5
    expect(convertToMoney(centsValue)).toBe(expectedMoney)
  })
})