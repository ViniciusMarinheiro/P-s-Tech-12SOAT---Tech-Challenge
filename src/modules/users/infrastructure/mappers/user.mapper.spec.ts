import { UserMapper } from './user.mapper'
import { User } from '../../domain/entities/user.entity'

describe('UserMapper', () => {
  describe('toDomain', () => {
    it('deve mapear corretamente um usuário admin para domínio', () => {
      const ormUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Administrador',
        email: 'joao.admin@example.com',
        password: '$2b$10$hashedPassword123',
        role: 'ADMIN',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T11:00:00Z'),
      } as any

      const result = UserMapper.toDomain(ormUser)

      expect(result).toBeInstanceOf(User)
      expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000')
      expect(result.name).toBe('João Administrador')
      expect(result.email).toBe('joao.admin@example.com')
      expect(result.password).toBe('$2b$10$hashedPassword123')
      expect(result.role).toBe('ADMIN')
      expect(result.createdAt).toEqual(new Date('2024-01-01T10:00:00Z'))
      expect(result.updatedAt).toEqual(new Date('2024-01-01T11:00:00Z'))
    })

    it('deve mapear corretamente um usuário técnico para domínio', () => {
      const ormUser = {
        id: '456e7890-e12c-34d5-b678-901234567890',
        name: 'Maria Técnica',
        email: 'maria.tecnica@example.com',
        password: '$2b$10$anotherHashedPassword456',
        role: 'TECHNICIAN',
        createdAt: new Date('2023-06-15T14:30:00Z'),
        updatedAt: new Date('2023-06-15T15:00:00Z'),
      } as any

      const result = UserMapper.toDomain(ormUser)

      expect(result).toBeInstanceOf(User)
      expect(result.id).toBe('456e7890-e12c-34d5-b678-901234567890')
      expect(result.name).toBe('Maria Técnica')
      expect(result.email).toBe('maria.tecnica@example.com')
      expect(result.password).toBe('$2b$10$anotherHashedPassword456')
      expect(result.role).toBe('TECHNICIAN')
      expect(result.createdAt).toEqual(new Date('2023-06-15T14:30:00Z'))
      expect(result.updatedAt).toEqual(new Date('2023-06-15T15:00:00Z'))
    })

    it('deve mapear corretamente um usuário comum para domínio', () => {
      const ormUser = {
        id: '789e0123-e45f-67g8-h901-234567890abc',
        name: 'Carlos Silva',
        email: 'carlos.silva@example.com',
        password: '$2b$10$yetAnotherHashedPassword789',
        role: 'USER',
        createdAt: new Date('2022-12-01T09:15:00Z'),
        updatedAt: new Date('2023-01-15T10:30:00Z'),
      } as any

      const result = UserMapper.toDomain(ormUser)

      expect(result.name).toBe('Carlos Silva')
      expect(result.email).toBe('carlos.silva@example.com')
      expect(result.role).toBe('USER')
      expect(result.createdAt).toEqual(new Date('2022-12-01T09:15:00Z'))
      expect(result.updatedAt).toEqual(new Date('2023-01-15T10:30:00Z'))
    })

    it('deve preservar todas as propriedades durante o mapeamento', () => {
      const ormUser = {
        id: 'test-user-id',
        name: 'Test User Name',
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'MANAGER',
        createdAt: new Date('2024-05-20T12:00:00Z'),
        updatedAt: new Date('2024-05-20T12:00:00Z'),
      } as any

      const result = UserMapper.toDomain(ormUser)

      // Verifica se todas as propriedades foram mapeadas corretamente
      expect(result.id).toBe('test-user-id')
      expect(result.name).toBe('Test User Name')
      expect(result.email).toBe('test@example.com')
      expect(result.password).toBe('hashed-password')
      expect(result.role).toBe('MANAGER')
      expect(result.createdAt).toEqual(new Date('2024-05-20T12:00:00Z'))
      expect(result.updatedAt).toEqual(new Date('2024-05-20T12:00:00Z'))
    })

    it('deve mapear usuário com nome contendo caracteres especiais', () => {
      const ormUser = {
        id: 'special-char-user-id',
        name: 'José María Ñoño',
        email: 'jose.maria@example.com',
        password: '$2b$10$specialCharPassword',
        role: 'TECHNICIAN',
        createdAt: new Date('2023-03-10T08:45:00Z'),
        updatedAt: new Date('2023-03-10T08:45:00Z'),
      } as any

      const result = UserMapper.toDomain(ormUser)

      expect(result.name).toBe('José María Ñoño')
      expect(result.email).toBe('jose.maria@example.com')
      expect(result.role).toBe('TECHNICIAN')
    })

    it('deve mapear usuário com datas iguais de criação e atualização', () => {
      const sameDate = new Date('2024-02-14T16:20:00Z')
      const ormUser = {
        id: 'same-dates-user-id',
        name: 'Ana Santos',
        email: 'ana.santos@example.com',
        password: '$2b$10$sameDatePassword',
        role: 'ADMIN',
        createdAt: sameDate,
        updatedAt: sameDate,
      } as any

      const result = UserMapper.toDomain(ormUser)

      expect(result.name).toBe('Ana Santos')
      expect(result.createdAt).toEqual(sameDate)
      expect(result.updatedAt).toEqual(sameDate)
      expect(result.createdAt).toEqual(result.updatedAt)
    })
  })
})