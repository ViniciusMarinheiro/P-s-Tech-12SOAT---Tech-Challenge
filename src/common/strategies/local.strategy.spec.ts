import { UnauthorizedException } from '@nestjs/common'
import { LocalStrategy } from './local.strategy'
import { UserRole } from '@/modules/auth/domain/enums/user-role.enum'
import { ValidateUserUseCase } from '@/modules/auth/application/use-cases/validate-user.use-case'

describe('LocalStrategy', () => {
  let strategy: LocalStrategy
  let validateUserUseCase: jest.Mocked<ValidateUserUseCase>

  beforeEach(() => {
    validateUserUseCase = { execute: jest.fn() } as any
    strategy = new LocalStrategy(validateUserUseCase)

    // Limpamos os mocks antes de cada teste
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  // --- Testes para o método `validate` ---
  describe('validate', () => {
    it('should return the user object when credentials are valid', async () => {
      // 1. Preparamos o cenário de sucesso
      const email = 'test@example.com'
      const password = 'password123'
      const user = {
        id: 1,
        email,
        name: 'Test User',
        auth: { strategy: 'local' },
        role: UserRole.ATTENDANT,
      }

      // Configuramos o mock para retornar o usuário
      ;(validateUserUseCase.execute as jest.Mock).mockResolvedValue(user)

      // 2. Executamos o método
      const result = await strategy.validate(email, password)

      // 3. Validamos o resultado
      expect(result).toEqual(user)
      expect(validateUserUseCase.execute).toHaveBeenCalledWith(email, password)
      expect(validateUserUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it('should throw an UnauthorizedException when credentials are invalid', async () => {
      // 1. Preparamos o cenário de falha
      const email = 'wrong@example.com'
      const password = 'wrongpassword'

      // Configuramos o mock para retornar null
      ;(validateUserUseCase.execute as jest.Mock).mockResolvedValue(null)

      // 2. Executamos o método e validamos a exceção
      await expect(strategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      )
      await expect(strategy.validate(email, password)).rejects.toThrow(
        'Credenciais inválidas',
      )
      expect(validateUserUseCase.execute).toHaveBeenCalledWith(email, password)
    })
  })
})
