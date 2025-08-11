import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserRepository } from '../users/repositories/user.repository'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

describe('AuthService', () => {
  let userRepository: any
  let jwtService: JwtService
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: 'UserRepository',
          useValue: {
            findByEmailAndPassword: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile()

    userRepository = module.get<UserRepository>('UserRepository')
  })

  it('should be defined', () => {
    expect(userRepository).toBeDefined()
  })

  afterAll(async () => {
    await module.close()
  })

  it('should validate user', async () => {
    const service: AuthService = new AuthService(
      userRepository,
      new JwtService(),
    )
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: (await bcrypt.hash('hashedpassword', 10)).toString(),
      role: 'USER',
    }
    userRepository.findByEmailAndPassword.mockResolvedValue(user)
    const result = await service.validateUser(
      'john@example.com',
      'hashedpassword',
    )
    const { password, ...userWithoutPassword } = user
    expect(result).toEqual(userWithoutPassword)
  })

  // next test:
  //   async register(registerDto: RegisterDto): Promise<RegisterResponse> {
  //     const existingUser = await this.userRepository.findByEmail(
  //       registerDto.email,
  //     )

  //     if (existingUser) {
  //       throw new BadRequestException('Email já está em uso')
  //     }

  //     const hashedPassword = await bcrypt.hash(registerDto.password, 10)

  //     const savedUser = await this.userRepository.create({
  //       name: registerDto.name,
  //       email: registerDto.email,
  //       password: hashedPassword,
  //       role: UserRole.ATTENDANT,
  //     })

  //     return {
  //       id: savedUser.id,
  //       name: savedUser.name,
  //       email: savedUser.email,
  //       role: savedUser.role,
  //       createdAt: savedUser.createdAt,
  //       updatedAt: savedUser.updatedAt,
  //     }
  //   }
  it('should register a new user', async () => {
    const service: AuthService = new AuthService(
      userRepository,
      new JwtService(),
    )
    const registerDto = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'plainpassword',
    }
    userRepository.findByEmail.mockResolvedValue(null)
    userRepository.create.mockResolvedValue({
      id: 2,
      ...registerDto,
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    const result = await service.register(registerDto)
    expect(result).toEqual({
      id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'USER',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  // next text:
  //   async getProfile(userId: number): Promise<RegisterResponse> {
  //     const user = await this.userRepository.findById(userId)
  //     if (!user) {
  //       throw new BadRequestException('Usuário não encontrado')
  //     }

  //     return {
  //       id: user.id,
  //       name: user.name,
  //       email: user.email,
  //       role: user.role,
  //       createdAt: user.createdAt,
  //       updatedAt: user.updatedAt,
  //     }
  //   }

  it('should get user profile', async () => {
    const service: AuthService = new AuthService(
      userRepository,
      new JwtService(),
    )
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    userRepository.findById.mockResolvedValue(user)
    const result = await service.getProfile(1)
    expect(result).toEqual(user)
  })
  it('should throw an error if user not found', async () => {
    const service: AuthService = new AuthService(
      userRepository,
      new JwtService(),
    )
    userRepository.findById.mockResolvedValue(null)
    await expect(service.getProfile(999)).rejects.toThrow(
      'Usuário não encontrado',
    )
  })
})
