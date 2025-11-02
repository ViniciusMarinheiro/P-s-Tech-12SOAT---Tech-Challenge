import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../infrastructure/web/auth.controller'
import { RegisterDto } from '../infrastructure/web/dto/register.dto'
import {
  LoginResponseDto,
  RegisterResponseDto,
} from '../infrastructure/web/dto/auth-response.dto'
import { UserProfileDto } from '../infrastructure/web/dto/user-profile.dto'
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception'
import { LoginUseCase } from '../application/use-cases/login.use-case'
import { RegisterUseCase } from '../application/use-cases/register.use-case'
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case'
import { UserRole } from '../domain/enums/user-role.enum'

describe('AuthController', () => {
  let controller: AuthController
  let loginUseCase: jest.Mocked<LoginUseCase>
  let registerUseCase: jest.Mocked<RegisterUseCase>
  let getProfileUseCase: jest.Mocked<GetProfileUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: LoginUseCase, useValue: { execute: jest.fn() } },
        { provide: RegisterUseCase, useValue: { execute: jest.fn() } },
        { provide: GetProfileUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile()

    controller = module.get(AuthController)
    loginUseCase = module.get(LoginUseCase)
    registerUseCase = module.get(RegisterUseCase)
    getProfileUseCase = module.get(GetProfileUseCase)
  })

  describe('login', () => {
    it('should return access token from use case', async () => {
      const mockUser = { id: 1, email: 'test@example.com' }
      const expectedResult: LoginResponseDto = {
        access_token: 'jwt.token.here',
      }

      loginUseCase.execute.mockResolvedValue(expectedResult as any)

      const result = await controller.login({ user: mockUser })

      expect(loginUseCase.execute).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual(expectedResult)
    })
    it('should throw UnauthorizedException when login fails', async () => {
      const mockUser = { id: 1, email: 'wrong@example.com' }
      loginUseCase.execute.mockRejectedValue(
        new UnauthorizedException('Credenciais inválidas'),
      )

      await expect(controller.login({ user: mockUser })).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })

  describe('register', () => {
    it('should create user and return RegisterResponseDto', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      }

      const expectedResult: RegisterResponseDto = {
        id: 1,
        email: registerDto.email,
        name: registerDto.name,
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      registerUseCase.execute.mockResolvedValue(expectedResult as any)

      const result = await controller.register(registerDto)

      expect(registerUseCase.execute).toHaveBeenCalledWith(registerDto)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('getProfile', () => {
    it('should return user profile from authService', async () => {
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        name: 'Mocked User',
        role: UserRole.ADMIN,
      }
      const expectedProfile: UserProfileDto = {
        id: 1,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      getProfileUseCase.execute.mockResolvedValue(expectedProfile as any)

      const result = await controller.getProfile(mockUser)

      expect(getProfileUseCase.execute).toHaveBeenCalledWith(mockUser.id)
      expect(result).toEqual(expectedProfile)
    })
  })

  it('should throw if register use case throws', async () => {
    const registerDto: RegisterDto = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
    }

    const error = new Error('E-mail already in use')
    registerUseCase.execute.mockRejectedValue(error)

    await expect(controller.register(registerDto)).rejects.toThrow(
      'E-mail already in use',
    )
    expect(registerUseCase.execute).toHaveBeenCalledWith(registerDto)
  })

  it('should throw if login use case throws', async () => {
    const mockUser = { id: 1, email: 'fail@example.com' }
    loginUseCase.execute.mockRejectedValue(new Error('Unexpected failure'))

    await expect(controller.login({ user: mockUser })).rejects.toThrow(
      'Unexpected failure',
    )
    expect(loginUseCase.execute).toHaveBeenCalledWith(mockUser)
  })
})
