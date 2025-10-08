import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { LoginUseCase } from '../application/use-cases/login.use-case'
import { AuthUser } from '../domain/interfaces/auth-response.interface'

describe('LoginUseCase', () => {
  let useCase: LoginUseCase
  let jwtService: jest.Mocked<JwtService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile()

    useCase = module.get(LoginUseCase)
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>
  })

  it('should sign and return access token', async () => {
    const user: AuthUser = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      role: 'admin' as any,
    }
    jwtService.sign.mockReturnValue('signed.jwt.token')

    const result = await useCase.execute(user)

    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role,
    })
    expect(result).toEqual({ access_token: 'signed.jwt.token' })
  })
})
