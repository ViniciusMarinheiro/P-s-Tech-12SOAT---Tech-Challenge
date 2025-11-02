import { ListUsersUseCase } from '../application/use-cases/list-users.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { makeUserDomain } from './mocks/user.domain.factory'

describe('ListUsersUseCase', () => {
  it('lists users from repository', async () => {
    const repo: jest.Mocked<UserRepositoryPort> = {
      findByEmail: jest.fn(),
      findByEmailAndPassword: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest
        .fn()
        .mockResolvedValue([makeUserDomain(), makeUserDomain()]),
    }
    const useCase = new ListUsersUseCase(repo)
    const users = await useCase.execute()
    expect(users.length).toBe(2)
  })
})
