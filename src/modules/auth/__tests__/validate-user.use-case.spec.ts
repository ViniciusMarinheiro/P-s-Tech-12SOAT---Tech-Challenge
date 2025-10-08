import { Test, TestingModule } from '@nestjs/testing'
import * as bcrypt from 'bcryptjs'
import { ValidateUserUseCase } from '../application/use-cases/validate-user.use-case'
import { UserRepositoryPort } from '../../users/domain/repositories/user.repository.port'

jest.mock('bcryptjs', () => ({ compare: jest.fn() }))

describe('ValidateUserUseCase', () => {
  let useCase: ValidateUserUseCase
  let userRepository: jest.Mocked<UserRepositoryPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateUserUseCase,
        {
          provide: UserRepositoryPort,
          useValue: { findByEmailAndPassword: jest.fn() },
        },
      ],
    }).compile()

    useCase = module.get(ValidateUserUseCase)
    userRepository = module.get(UserRepositoryPort)
  })

  it('should return null if user not found', async () => {
    userRepository.findByEmailAndPassword.mockResolvedValue(null as any)
    const result = await useCase.execute('a@b.com', 'x')
    expect(result).toBeNull()
  })

  it('should return auth user when password matches', async () => {
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    userRepository.findByEmailAndPassword.mockResolvedValue({
      id: 1,
      name: 'John',
      email: 'john@example.com',
      role: 'admin',
      password: 'hashed',
    } as any)
    const result = await useCase.execute('john@example.com', 'secret')
    expect(result).toEqual({
      id: 1,
      name: 'John',
      email: 'john@example.com',
      role: 'admin',
    })
  })

  it('should return null when password does not match', async () => {
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)
    userRepository.findByEmailAndPassword.mockResolvedValue({
      id: 1,
      name: 'John',
      email: 'john@example.com',
      role: 'admin',
      password: 'hashed',
    } as any)
    const result = await useCase.execute('john@example.com', 'wrong')
    expect(result).toBeNull()
  })
})
