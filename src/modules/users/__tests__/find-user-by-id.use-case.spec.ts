import { FindUserByIdUseCase } from '../application/use-cases/find-user-by-id.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { makeUserDomain } from './mocks/user.domain.factory'
import { CustomException } from '@/common/exceptions/customException'

describe('FindUserByIdUseCase', () => {
  it('returns user when found', async () => {
    const repo: jest.Mocked<UserRepositoryPort> = {
      findByEmail: jest.fn(),
      findByEmailAndPassword: jest.fn(),
      findById: jest.fn().mockResolvedValue(makeUserDomain({ id: 5 })),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    }
    const useCase = new FindUserByIdUseCase(repo)
    const user = await useCase.execute(5)
    expect(user.id).toBe(5)
  })

  it('throws when not found', async () => {
    const repo: jest.Mocked<UserRepositoryPort> = {
      findByEmail: jest.fn(),
      findByEmailAndPassword: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    }
    const useCase = new FindUserByIdUseCase(repo)
    await expect(useCase.execute(1)).rejects.toBeInstanceOf(CustomException)
  })
})
