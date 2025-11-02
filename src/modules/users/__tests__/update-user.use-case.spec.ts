import { UpdateUserUseCase } from '../application/use-cases/update-user.use-case'
import { UserRepositoryPort } from '../domain/repositories/user.repository.port'
import { makeUserDomain } from './mocks/user.domain.factory'
import { CustomException } from '@/common/exceptions/customException'

describe('UpdateUserUseCase', () => {
  it('updates when user exists', async () => {
    const repo: jest.Mocked<UserRepositoryPort> = {
      findByEmail: jest.fn(),
      findByEmailAndPassword: jest.fn(),
      findById: jest.fn().mockResolvedValue(makeUserDomain({ id: 10 })),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue(makeUserDomain({ name: 'Jane' })),
      delete: jest.fn(),
      findAll: jest.fn(),
    }
    const useCase = new UpdateUserUseCase(repo)
    const user = await useCase.execute(10, { name: 'Jane' })
    expect(repo.update).toHaveBeenCalledWith(10, { name: 'Jane' })
    expect(user.name).toBe('Jane')
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
    const useCase = new UpdateUserUseCase(repo)
    await expect(useCase.execute(10, { name: 'Jane' })).rejects.toBeInstanceOf(
      CustomException,
    )
  })
})
