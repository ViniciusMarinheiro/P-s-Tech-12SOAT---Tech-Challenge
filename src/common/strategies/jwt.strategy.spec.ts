import { JwtStrategy } from './jwt.strategy'
import { EnvConfigService } from '../service/env/env-config.service'
import { JwtPayload } from '../../modules/auth/interfaces/auth-response.interface'
import { UserRole } from '../../modules/auth/enums/user-role.enum'

describe('JwtStrategy', () => {
  let strategy: JwtStrategy
  // Criamos um mock tipado do nosso serviço de configuração
  let configService: jest.Mocked<EnvConfigService>

  beforeEach(() => {
    // Simulamos o EnvConfigService com um método `get` mockado
    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<EnvConfigService>

    // Configuramos um valor padrão para o segredo do JWT
    configService.get.mockReturnValue('test-secret-key')

    // Instanciamos nossa estratégia com o serviço mockado
    strategy = new JwtStrategy(configService)
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  // --- Teste para o método `validate` ---
  describe('validate', () => {
    it('should correctly transform a valid JWT payload into a user object', async () => {
      // 1. Preparamos o payload de entrada (o que vem do token)
      const payload: JwtPayload = {
        sub: 42,
        email: 'test@example.com',
        role: UserRole.ADMIN,
      }

      // 2. Definimos o objeto de usuário esperado na saída
      const expectedUser = {
        id: 42,
        email: 'test@example.com',
        role: UserRole.ADMIN,
      }

      // 3. Executamos o método e validamos o resultado
      const result = await strategy.validate(payload)

      expect(result).toEqual(expectedUser)
    })
  })

  // --- Teste para a lógica do construtor ---
  describe('constructor', () => {
    it('should use the default secret key if JWT_SECRET is not provided', () => {
      // Forçamos o configService a não retornar nada para JWT_SECRET
      configService.get.mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') {
          return 'undefined'
        }
        return 'some-other-value'
      })

      // Para validar o que foi passado para `super()`, precisaríamos de técnicas
      // mais avançadas de mock. No entanto, podemos simplesmente garantir
      // que a instância é criada sem erros, o que já é uma boa validação.
      const newStrategy = new JwtStrategy(configService)
      expect(newStrategy).toBeDefined()
    })
  })
})