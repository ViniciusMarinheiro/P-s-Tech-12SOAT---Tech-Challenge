export const ErrorMessages = {
  USER: {
    NOT_FOUND: (id: number) => `Usuário com ID ${id} não encontrado`,
    ALREADY_EXISTS: (email: string) => `Usuário com email ${email} já existe`,
    INVALID_CREDENTIALS: () => 'Credenciais inválidas',
    UNAUTHORIZED: () => 'Usuário não autorizado',
    FORBIDDEN: () => 'Acesso negado',
  },
  CUSTOMER: {
    NOT_FOUND: (id: number) => `Cliente com ID ${id} não encontrado`,
    ALREADY_EXISTS: () => `Cliente já existe`,
  },
  VEHICLE: {
    NOT_FOUND: (id: number) => `Veículo com ID ${id} não encontrado`,
    ALREADY_EXISTS: (plate: string) => `Veículo com placa ${plate} já existe`,
  },
  SERVICE: {
    NOT_FOUND: () => `Serviço não encontrado`,
    ALREADY_EXISTS: (name: string) => `Serviço com nome ${name} já existe`,
  },
  WORK_ORDER: {
    NOT_FOUND: (id: number) => `Ordem de serviço com ID ${id} não encontrada`,
    INVALID_STATUS: (status: string) =>
      `Status ${status} inválido para ordem de serviço`,
  },
  VALIDATION: {
    INVALID_PHONE: () =>
      'Telefone deve ser um número válido brasileiro (DDD + número)',
    INVALID_DOCUMENT: () =>
      'Documento deve ser um CPF válido (11 dígitos) ou CNPJ válido (14 dígitos)',
    INVALID_EMAIL: () => 'Email deve ser um endereço válido',
    REQUIRED_FIELD: (field: string) => `Campo ${field} é obrigatório`,
  },
  GENERAL: {
    VALIDATION_ERROR: (field: string) => `Erro de validação no campo: ${field}`,
    INTERNAL_ERROR: () => 'Erro interno do servidor',
    BAD_REQUEST: () => 'Requisição inválida',
    NOT_FOUND: (resource: string) => `${resource} não encontrado`,
  },
}
