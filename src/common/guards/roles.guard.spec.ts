import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '../../modules/auth/enums/user-role.enum'
import { RolesGuard } from './roles.guard'

describe('RolesGuard', () => {
  let guard: RolesGuard
  let reflector: Reflector

  beforeEach(() => {
    // Instanciamos as dependências antes de cada teste
    reflector = new Reflector()
    guard = new RolesGuard(reflector)
  })

  // Uma função auxiliar para criar um mock do ExecutionContext de forma limpa
  const createMockContext = (user: any, requiredRoles: UserRole[] | null) => {
    // Mockamos o que o reflector vai retornar
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles)

    // Retornamos um objeto que simula o ExecutionContext
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext
  }

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  // --- Testes para o método `canActivate` ---
  describe('canActivate', () => {
    it('should return TRUE if no roles are required for the route', () => {
      // Cenário 1: O reflector não retorna roles, então a rota é "pública" em termos de roles
      const context = createMockContext({ role: UserRole.ATTENDANT }, null)
      expect(guard.canActivate(context)).toBe(true)
    })

    it('should return TRUE if the user has the required role', () => {
      // Cenário 2: Rota exige ADMIN, e o usuário é ADMIN
      const requiredRoles = [UserRole.ADMIN]
      const user = { role: UserRole.ADMIN }
      const context = createMockContext(user, requiredRoles)
      expect(guard.canActivate(context)).toBe(true)
    })

    it('should return TRUE if the user has at least one of the required roles', () => {
      // Cenário 3: Rota exige ADMIN ou MANAGER, e o usuário é MANAGER
      const requiredRoles = [UserRole.ADMIN, UserRole.ATTENDANT]
      const user = { role: UserRole.ATTENDANT }
      const context = createMockContext(user, requiredRoles)
      expect(guard.canActivate(context)).toBe(true)
    })

    it('should return FALSE if the user does not have the required role', () => {
      // Cenário 4: Rota exige ADMIN, mas o usuário é ATTENDANT
      const requiredRoles = [UserRole.ADMIN]
      const user = { role: UserRole.ATTENDANT }
      const context = createMockContext(user, requiredRoles)
      expect(guard.canActivate(context)).toBe(false)
    })

    it('should return FALSE if the user object has no role property', () => {
      // Cenário 5: Rota exige ADMIN, mas o objeto `user` não tem a propriedade `role`
      const requiredRoles = [UserRole.ADMIN]
      const user = { id: 1, name: 'Test' } // Sem a propriedade 'role'
      const context = createMockContext(user, requiredRoles)
      expect(guard.canActivate(context)).toBe(false)
    })
  })
})
