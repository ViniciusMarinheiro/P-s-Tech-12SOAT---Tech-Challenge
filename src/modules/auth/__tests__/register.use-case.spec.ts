import { Test, TestingModule } from '@nestjs/testing'
import * as bcrypt from 'bcryptjs'
import { RegisterUseCase } from '../application/use-cases/register.use-case'
import { UserRepositoryPort } from '../../users/domain/repositories/user.repository.port'
import { UserRole } from '../domain/enums/user-role.enum'

jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed') }))

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase
  let userRepository: jest.Mocked<UserRepositoryPort>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        {
          provide: UserRepositoryPort,
          useValue: { findByEmail: jest.fn(), create: jest.fn() },
        },
      ],
    }).compile()

    useCase = module.get(RegisterUseCase)
    userRepository = module.get(UserRepositoryPort)
  })

  it('should throw if email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 1 } as any)
    await expect(
      useCase.execute({ name: 'A', email: 'a@b.com', password: 'x' }),
    ).rejects.toThrow('Email já está em uso')
  })

  it('should create user with hashed password and ATTENDANT role', async () => {
    userRepository.findByEmail.mockResolvedValue(null as any)
    userRepository.create.mockResolvedValue({
      id: 10,
      name: 'A',
      email: 'a@b.com',
      role: UserRole.ATTENDANT,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    const result = await useCase.execute({
      name: 'A',
      email: 'a@b.com',
      password: 'x',
    })

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'A',
        email: 'a@b.com',
        password: 'hashed',
        role: UserRole.ATTENDANT,
      }),
    )
    expect(result).toEqual(
      expect.objectContaining({ id: 10, email: 'a@b.com' }),
    )
  })
})
