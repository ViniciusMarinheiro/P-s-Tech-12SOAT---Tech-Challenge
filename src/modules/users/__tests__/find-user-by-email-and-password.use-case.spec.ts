import { FindUserByEmailAndPasswordUseCase } from '../application/use-cases/find-user-by-email-and-password.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { makeUserDomain } from './mocks/user.domain.factory'

describe('FindUserByEmailAndPasswordUseCase', () => {
  it('returns user when found', async () => {
    const repo: jest.Mocked<UserRepositoryPort> = {
      findByEmail: jest.fn(),
      findByEmailAndPassword: jest
        .fn()
        .mockResolvedValue(makeUserDomain({ email: 'a@a.com' })),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    }
    const useCase = new FindUserByEmailAndPasswordUseCase(repo)
    const user = await useCase.execute('a@a.com')
    expect(user?.email).toBe('a@a.com')
  })
})
