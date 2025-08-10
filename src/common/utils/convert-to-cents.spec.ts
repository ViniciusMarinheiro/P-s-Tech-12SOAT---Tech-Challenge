import { convertToCents } from './convert-to-cents'

describe('convertToCents', () => {
  it('should convert an integer value to cents', () => {
    // Cenário com número inteiro
    const value = 150
    const expectedCents = 15000
    expect(convertToCents(value)).toBe(expectedCents)
  })

  it('should convert a decimal value to cents', () => {
    // Cenário com número decimal
    const value = 75.5
    const expectedCents = 7550
    expect(convertToCents(value)).toBe(expectedCents)
  })

  it('should handle zero correctly', () => {
    // Cenário com zero
    const value = 0
    const expectedCents = 0
    expect(convertToCents(value)).toBe(expectedCents)
  })

  it('should handle floating point values correctly', () => {
    // Cenário comum que pode causar problemas de ponto flutuante
    const value = 19.99
    const expectedCents = 1999
    expect(convertToCents(value)).toBe(expectedCents)
  })
})
