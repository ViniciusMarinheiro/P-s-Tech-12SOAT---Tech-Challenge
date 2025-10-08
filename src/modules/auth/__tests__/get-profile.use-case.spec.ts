import { Test, TestingModule } from '@nestjs/testing'
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case'
import { UserRepositoryPort } from '../../users/domain/repositories/user.repository.port'

describe('GetProfileUseCase', () => {
  let useCase: GetProfileUseCase
  let userRepository: jest.Mocked<UserRepositoryPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProfileUseCase,
        {
          provide: UserRepositoryPort,
          useValue: { findById: jest.fn() },
        },
      ],
    }).compile()

    useCase = module.get(GetProfileUseCase)
    userRepository = module.get(UserRepositoryPort)
  })

  it('should throw when user not found', async () => {
    userRepository.findById.mockResolvedValue(null as any)
    await expect(useCase.execute(123)).rejects.toThrow('Usuário não encontrado')
  })

  it('should return user when found', async () => {
    userRepository.findById.mockResolvedValue({
      id: 123,
      email: 'x@y.com',
    } as any)
    const result = await useCase.execute(123)
    expect(result).toEqual({ id: 123, email: 'x@y.com' })
  })
})
