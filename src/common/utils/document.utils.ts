/**
 * Utilitários para trabalhar com documentos (CPF/CNPJ)
 */

export enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

/**
 * Remove formatação de documento (pontos, traços, barras)
 */
export function removeDocumentFormatting(document: string): string {
  return document.replace(/[^\d]/g, '')
}

/**
 * Detecta o tipo de documento baseado no número de caracteres
 */
export function detectDocumentType(document: string): DocumentType {
  const cleanDocument = removeDocumentFormatting(document)

  if (cleanDocument.length === 11) {
    return DocumentType.CPF
  } else if (cleanDocument.length === 14) {
    return DocumentType.CNPJ
  } else {
    throw new Error('Documento deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ)')
  }
}

/**
 * Valida se o CPF é válido
 */
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = removeDocumentFormatting(cpf)

  if (cleanCPF.length !== 11) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false

  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false

  return true
}

/**
 * Valida se o CNPJ é válido
 */
export function isValidCNPJ(cnpj: string): boolean {
  const cleanCNPJ = removeDocumentFormatting(cnpj)

  if (cleanCNPJ.length !== 14) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false

  // Validação do primeiro dígito verificador
  let sum = 0
  let weight = 2
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  let remainder = sum % 11
  const digit1 = remainder < 2 ? 0 : 11 - remainder
  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false

  // Validação do segundo dígito verificador
  sum = 0
  weight = 2
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  remainder = sum % 11
  const digit2 = remainder < 2 ? 0 : 11 - remainder
  if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false

  return true
}

/**
 * Valida documento (CPF ou CNPJ) automaticamente
 */
export function isValidDocument(document: string): boolean {
  const cleanDocument = removeDocumentFormatting(document)

  try {
    const type = detectDocumentType(cleanDocument)

    if (type === DocumentType.CPF) {
      return isValidCPF(cleanDocument)
    } else {
      return isValidCNPJ(cleanDocument)
    }
  } catch {
    return false
  }
}
