import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RegisterDto } from './dtos/register.dto'
import { LoginResponseDto, RegisterResponseDto } from './dtos/auth-response.dto'
import { UserProfileDto } from './dtos/user-profile.dto'
import { UserRole } from './enums/user-role.enum'
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception'

describe('AuthController', () => {
  let controller: AuthController
  let authService: jest.Mocked<AuthService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            getProfile: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get(AuthController)
    authService = module.get(AuthService)
  })

  describe('login', () => {
    it('should return access token from authService', async () => {
      const mockUser = { id: 1, email: 'test@example.com' }
      const expectedResult: LoginResponseDto = { access_token: 'jwt.token.here' }

      authService.login.mockResolvedValue(expectedResult)

      const result = await controller.login({ user: mockUser })

      expect(authService.login).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual(expectedResult)
    });
    it('should throw UnauthorizedException when login fails', async () => {
    const mockUser = { id: 1, email: 'wrong@example.com' }
    authService.login.mockRejectedValue(new UnauthorizedException('Credenciais inválidas'))

    await expect(controller.login({ user: mockUser })).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('register', () => {
    it('should create user and return RegisterResponseDto', async () => {
      const registerDto: RegisterDto = {
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User'
      }

      const expectedResult: RegisterResponseDto = {
          id: 1,
          email: registerDto.email,
          name: registerDto.name,
          role: UserRole.ADMIN,
          createdAt: new Date(),
          updatedAt: new Date()
      }

      authService.register.mockResolvedValue(expectedResult)

      const result = await controller.register(registerDto)

      expect(authService.register).toHaveBeenCalledWith(registerDto)
      expect(result).toEqual(expectedResult)
    })
  })

  describe('getProfile', () => {
    it('should return user profile from authService', async () => {
      const mockUser = { id: 1, email: 'user@example.com', name: 'Mocked User', role: UserRole.ADMIN }
      const expectedProfile: UserProfileDto = {
          id: 1,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          createdAt: new Date(),
          updatedAt: new Date()
      }

      authService.getProfile.mockResolvedValue(expectedProfile)

      const result = await controller.getProfile(mockUser)

      expect(authService.getProfile).toHaveBeenCalledWith(mockUser.id)
      expect(result).toEqual(expectedProfile)
    })
  })

    it('should throw if authService.register throws', async () => {
    const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
    }

    const error = new Error('E-mail already in use')
    authService.register.mockRejectedValue(error)

    await expect(controller.register(registerDto)).rejects.toThrow('E-mail already in use')
    expect(authService.register).toHaveBeenCalledWith(registerDto)
    })

    it('should throw if authService.login throws', async () => {
    const mockUser = { id: 1, email: 'fail@example.com' }
    authService.login.mockRejectedValue(new Error('Unexpected failure'))

    await expect(controller.login({ user: mockUser })).rejects.toThrow('Unexpected failure')
    expect(authService.login).toHaveBeenCalledWith(mockUser)
    })
})
