import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../../modules/auth/auth.service'
import { LocalStrategy } from './local.strategy'
import { UserRole } from '@/modules/auth/enums/user-role.enum'
import { User } from '@/modules/users/entities/user.entity'

describe('LocalStrategy', () => {
  let strategy: LocalStrategy
  // Criamos um mock tipado do AuthService
  let authService: jest.Mocked<AuthService>

  beforeEach(() => {
    // Simulamos o AuthService com o método `validateUser` mockado
    authService = {
      validateUser: jest.fn(),
    } as any // Usamos 'as any' para simplificar o mock parcial

    // Instanciamos a estratégia com o serviço mockado
    strategy = new LocalStrategy(authService)

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
      authService.validateUser.mockResolvedValue(user)

      // 2. Executamos o método
      const result = await strategy.validate(email, password)

      // 3. Validamos o resultado
      expect(result).toEqual(user)
      expect(authService.validateUser).toHaveBeenCalledWith(email, password)
      expect(authService.validateUser).toHaveBeenCalledTimes(1)
    })

    it('should throw an UnauthorizedException when credentials are invalid', async () => {
      // 1. Preparamos o cenário de falha
      const email = 'wrong@example.com'
      const password = 'wrongpassword'

      // Configuramos o mock para retornar null
      authService.validateUser.mockResolvedValue(null)

      // 2. Executamos o método e validamos a exceção
      await expect(strategy.validate(email, password)).rejects.toThrow(
        UnauthorizedException,
      )
      await expect(strategy.validate(email, password)).rejects.toThrow(
        'Credenciais inválidas',
      )
      expect(authService.validateUser).toHaveBeenCalledWith(email, password)
    })
  })
})
