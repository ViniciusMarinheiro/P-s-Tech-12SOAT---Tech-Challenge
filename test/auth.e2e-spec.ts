import 'crypto'
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../src/modules/auth/dtos/register.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from '@/modules/auth/enums/user-role.enum';
import * as bcrypt from 'bcryptjs'

describe('AuthController (E2E)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let jwtTokenAdmin: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    const hashedPassword = await bcrypt.hash('StrongPassword123', 10)
    userRepository.save({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    const loginResponseAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'StrongPassword123',
      });
    jwtTokenAdmin = loginResponseAdmin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should create a new user and return user data', () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        name: 'Test User',
      };
      return request(app.getHttpServer())
        .post('/auth/register')
        .set('Authorization', `Bearer ${jwtTokenAdmin}`)
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
          });
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login a registered user and return an access token', async () => {
      const hashedUserPassword = await bcrypt.hash('StrongPassword123', 10)
      const user = {
        email: 'login@example.com',
        password: hashedUserPassword,
        name: 'Login User',
        role: UserRole.ATTENDANT,
      };
      userRepository.save(user);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: 'StrongPassword123' })
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token');
          expect(response.body.access_token).toEqual(expect.any(String));
        });
    });

    it('should return Unauthorized for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'wrong@user.com', password: 'wrongpassword' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
