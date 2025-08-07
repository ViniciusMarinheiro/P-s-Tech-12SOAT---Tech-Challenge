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
    ALREADY_EXISTS: (document: string) =>
      `Cliente com documento ${document} já existe`,
  },
  VEHICLE: {
    NOT_FOUND: (id: number) => `Veículo com ID ${id} não encontrado`,
    ALREADY_EXISTS: (plate: string) => `Veículo com placa ${plate} já existe`,
  },
  WORK_ORDER: {
    NOT_FOUND: (id: number) => `Ordem de serviço com ID ${id} não encontrada`,
    INVALID_STATUS: (status: string) =>
      `Status ${status} inválido para ordem de serviço`,
  },
  GENERAL: {
    VALIDATION_ERROR: (field: string) => `Erro de validação no campo: ${field}`,
    INTERNAL_ERROR: () => 'Erro interno do servidor',
    BAD_REQUEST: () => 'Requisição inválida',
    NOT_FOUND: (resource: string) => `${resource} não encontrado`,
  },
}
