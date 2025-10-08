import { FindUserByEmailUseCase } from '../application/use-cases/find-user-by-email.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { makeUserDomain } from './mocks/user.domain.factory'

describe('FindUserByEmailUseCase', () => {
  it('returns user when found', async () => {
    const repo: jest.Mocked<UserRepositoryPort> = {
      findByEmail: jest
        .fn()
        .mockResolvedValue(makeUserDomain({ email: 'a@a.com' })),
      findByEmailAndPassword: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    }
    const useCase = new FindUserByEmailUseCase(repo)
    const user = await useCase.execute('a@a.com')
    expect(user?.email).toBe('a@a.com')
  })
})
