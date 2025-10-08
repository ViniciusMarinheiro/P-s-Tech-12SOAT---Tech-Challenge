import { CreateUserUseCase } from '../application/use-cases/create-user.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { makeUserDomain } from './mocks/user.domain.factory'

describe('CreateUserUseCase', () => {
  it('creates a user via repository', async () => {
    const repo: jest.Mocked<UserRepositoryPort> = {
      findByEmail: jest.fn(),
      findByEmailAndPassword: jest.fn(),
      findById: jest.fn(),
      create: jest.fn().mockResolvedValue(makeUserDomain()),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    }

    const useCase = new CreateUserUseCase(repo)
    const result = await useCase.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'secret',
    })

    expect(repo.create).toHaveBeenCalled()
    expect(result.email).toBe('john@example.com')
  })
})
