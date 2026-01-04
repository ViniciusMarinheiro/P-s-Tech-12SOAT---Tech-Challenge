const SENSITIVE_FIELDS = [
  'password',
  'senha',
  'cpf',
  'cnpj',
  'documentNumber',
  'document',
  'phone',
  'telefone',
  'email',
  'token',
  'access_token',
  'refresh_token',
  'secret',
  'apiKey',
  'api_key',
  'authorization',
] as const

const MASK_CHAR = '*'

function maskString(value: string, visibleStart = 2, visibleEnd = 2): string {
  if (!value || value.length <= visibleStart + visibleEnd) {
    return MASK_CHAR.repeat(value?.length || 0)
  }
  const start = value.substring(0, visibleStart)
  const end = value.substring(value.length - visibleEnd)
  const masked = MASK_CHAR.repeat(value.length - visibleStart - visibleEnd)
  return `${start}${masked}${end}`
}

function maskDocument(document: string): string {
  const cleaned = document.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return `${cleaned.substring(0, 3)}.***.***-${cleaned.substring(9)}`
  } else if (cleaned.length === 14) {
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.***/${cleaned.substring(8, 12)}-${cleaned.substring(12)}`
  }
  return maskString(document, 2, 2)
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (!domain) return maskString(email, 2, 2)
  const maskedUser = maskString(user, 2, 0)
  return `${maskedUser}@${domain}`
}

function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length >= 10) {
    const ddd = cleaned.substring(0, 2)
    const lastDigits = cleaned.substring(cleaned.length - 2)
    return `(${ddd}) *****-${lastDigits}`
  }
  return maskString(phone, 2, 2)
}

function sanitizeValue(fieldName: string, value: any): any {
  if (value === null || value === undefined) {
    return value
  }

  const lowerFieldName = fieldName.toLowerCase()

  if (typeof value === 'string') {
    if (
      lowerFieldName.includes('document') ||
      lowerFieldName === 'cpf' ||
      lowerFieldName === 'cnpj'
    ) {
      return maskDocument(value)
    }
    if (lowerFieldName.includes('email')) {
      return maskEmail(value)
    }
    if (
      lowerFieldName.includes('phone') ||
      lowerFieldName.includes('telefone')
    ) {
      return maskPhone(value)
    }
    if (
      lowerFieldName.includes('password') ||
      lowerFieldName.includes('senha') ||
      lowerFieldName.includes('token') ||
      lowerFieldName.includes('secret') ||
      lowerFieldName.includes('key')
    ) {
      return MASK_CHAR.repeat(8)
    }
  }

  return value
}

function isSensitiveField(fieldName: string): boolean {
  const lowerFieldName = fieldName.toLowerCase()
  return SENSITIVE_FIELDS.some((field) => lowerFieldName.includes(field))
}

export function sanitizeSensitiveData(data: any): any {
  if (data === null || data === undefined) {
    return data
  }

  if (typeof data !== 'object') {
    return data
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeSensitiveData(item))
  }

  const sanitized: any = {}
  for (const [key, value] of Object.entries(data)) {
    if (isSensitiveField(key)) {
      sanitized[key] = sanitizeValue(key, value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeSensitiveData(value)
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}
