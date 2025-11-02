import { DeleteUserUseCase } from '../application/use-cases/delete-user.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { makeUserDomain } from './mocks/user.domain.factory'
import { CustomException } from '@/common/exceptions/customException'

describe('DeleteUserUseCase', () => {
  it('deletes when user exists', async () => {
    const repo: jest.Mocked<UserRepositoryPort> = {
      findByEmail: jest.fn(),
      findByEmailAndPassword: jest.fn(),
      findById: jest.fn().mockResolvedValue(makeUserDomain({ id: 10 })),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    }
    const useCase = new DeleteUserUseCase(repo)
    await useCase.execute(10)
    expect(repo.delete).toHaveBeenCalledWith(10)
  })

  it('throws when user does not exist', async () => {
    const repo: jest.Mocked<UserRepositoryPort> = {
      findByEmail: jest.fn(),
      findByEmailAndPassword: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    }
    const useCase = new DeleteUserUseCase(repo)
    await expect(useCase.execute(10)).rejects.toBeInstanceOf(CustomException)
  })
})
