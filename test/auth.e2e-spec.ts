import 'crypto'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../src/modules/users/entities/user.entity'
import { Repository } from 'typeorm'
import { RegisterDto } from '../src/modules/auth/dtos/register.dto'
import { UserRole } from '../src/modules/auth/enums/user-role.enum'
import { seed } from '../src/config/database/seeds/seed'

describe('AuthController (E2E)', () => {
  let app: INestApplication
  let userRepository: Repository<User>
  let adminToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    userRepository = moduleFixture.get('UserRepository')

    let adminUser = await userRepository.findOne({
      where: { email: 'adm@gmail.com' },
    })

    if (!adminUser) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123@', 10)

      adminUser = await userRepository.save({
        email: 'adm@gmail.com',
        password: hashedPassword,
        name: 'Admin Test',
        role: UserRole.ADMIN,
      })
      console.log('✅ Usuário admin criado:', adminUser.email)
    }

    let joaoUser = await userRepository.findOne({
      where: { email: 'joao@email.com' },
    })

    if (!joaoUser) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123@', 10)

      joaoUser = await userRepository.save({
        email: 'joao@email.com',
        password: hashedPassword,
        name: 'João Silva',
        role: UserRole.ATTENDANT,
      })
    }

    // Debug: verificar usuários no banco após criação
    const allUsers = await userRepository.find()
    console.log(
      '👥 Todos os usuários no banco:',
      allUsers.map((u) => ({ id: u.id, email: u.email, role: u.role })),
    )

    // Fazer login como admin existente do seed
    const loginResponse = await (request(app.getHttpServer()) as any)
      .post('/auth/login')
      .send({ email: 'adm@gmail.com', password: 'admin123@' })

    adminToken = loginResponse.body.access_token
  })

  beforeEach(async () => {
    // Limpar apenas usuários que não são admin (preservar o admin do seed)
    await userRepository.delete({ role: UserRole.ATTENDANT })
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/auth/register (POST)', () => {
    it('should create a new user when admin is authenticated', () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        name: 'Test User',
      }

      return (request(app.getHttpServer()) as any)
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(registerDto)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          // Verifica a estrutura e os dados da resposta
          expect(response.body).toEqual({
            id: expect.any(Number),
            email: registerDto.email,
            name: registerDto.name,
            role: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          })
        })
    })

    it('should return a Bad Request if email is already in use', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        name: 'Test User',
      }
      // Cria o usuário pela primeira vez usando o admin
      await (request(app.getHttpServer()) as any)
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(registerDto)

      // Tenta registrar com o mesmo e-mail
      return (request(app.getHttpServer()) as any)
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(registerDto)
        .expect(HttpStatus.BAD_REQUEST)
    })

    it('should return 401 Unauthorized if no token is provided', () => {
      const registerDto: RegisterDto = {
        email: 'unauthorized@test.com',
        password: 'StrongPassword123!',
        name: 'Unauthorized User',
      }

      return (request(app.getHttpServer()) as any)
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })
  })

  describe('/auth/login (POST)', () => {
    it('should login a registered user and return an access token', async () => {
      const hashedUserPassword = await bcrypt.hash('StrongPassword123', 10)
      const user = {
        email: 'login@example.com',
        password: hashedUserPassword,
        name: 'Login User',
      }

      // 1. Primeiro, registra um usuário usando o admin
      await (request(app.getHttpServer()) as any)
        .post('/auth/register')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(user)

      // 2. Agora, tenta fazer o login com as credenciais corretas
      return (request(app.getHttpServer()) as any)
        .post('/auth/login')
        .send({ email: user.email, password: 'StrongPassword123' })
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token')
          expect(response.body.access_token).toEqual(expect.any(String))
        })
    })

    it('should return Unauthorized for invalid credentials', () => {
      return (request(app.getHttpServer()) as any)
        .post('/auth/login')
        .send({ email: 'wrong@user.com', password: 'wrongpassword' })
        .expect(HttpStatus.UNAUTHORIZED)
    })
  })
})
