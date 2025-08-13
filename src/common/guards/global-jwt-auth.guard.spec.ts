import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GlobalJwtAuthGuard } from './global-jwt-auth.guard'

describe('GlobalJwtAuthGuard', () => {
  let guard: GlobalJwtAuthGuard
  let reflector: Reflector

  // Antes de cada teste, criamos novas instâncias do Guard e do Reflector
  beforeEach(() => {
    reflector = new Reflector() // O Reflector não precisa ser um mock complexo
    guard = new GlobalJwtAuthGuard(reflector)
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  // --- Testes para o método `canActivate` ---
  describe('canActivate', () => {
    // Criamos um mock do ExecutionContext, que é o argumento do canActivate
    const mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    } as unknown as ExecutionContext

    it('should return TRUE if the route is public', () => {
      // 1. Configuramos o mock: Dizemos ao Reflector para retornar `true`
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true)

      // 2. Executamos o método
      const canActivate = guard.canActivate(mockContext)

      // 3. Validamos o resultado
      expect(canActivate).toBe(true)
      expect(reflector.getAllAndOverride).toHaveBeenCalled()
    })

    it('should delegate to parent AuthGuard if the route is NOT public', () => {
      // 1. Configuramos o mock: Dizemos ao Reflector para retornar `false`
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)

      // 2. Espionamos o método `canActivate` da classe pai (`AuthGuard`)
      // e forçamos ele a retornar um valor conhecido (ex: `true`)
      const superCanActivate = jest
        .spyOn(Object.getPrototypeOf(guard), 'canActivate')
        .mockReturnValue(true)

      // 3. Executamos o método
      const canActivate = guard.canActivate(mockContext)

      // 4. Validamos que o nosso guard retornou o mesmo que o pai
      expect(canActivate).toBe(true)
      // E o mais importante: validamos que o método do pai foi chamado
      expect(superCanActivate).toHaveBeenCalledWith(mockContext)
    })

    it('should also delegate to parent guard when it returns a Promise', async () => {
      // Testando um cenário assíncrono, comum em guards
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)

      // O `super.canActivate` pode retornar uma Promise
      const superCanActivate = jest
        .spyOn(Object.getPrototypeOf(guard), 'canActivate')
        .mockResolvedValue(true) // Usamos mockResolvedValue para Promises

      const canActivate = await guard.canActivate(mockContext)

      expect(canActivate).toBe(true)
      expect(superCanActivate).toHaveBeenCalledWith(mockContext)
    })
  })
})
