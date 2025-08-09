import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from '../src/modules/auth/dtos/register.dto';

describe('AuthController (E2E)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  // `beforeAll` é executado uma vez antes de todos os testes neste arquivo
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // 1. Importa o módulo principal da sua aplicação
        AppModule,
        // 2. Sobrescreve a configuração do banco de dados para usar o SQLite em memória
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:', // Isso garante um banco de dados limpo e em RAM
          entities: [User], // Importante: Liste todas as entidades usadas no fluxo
          synchronize: true, // Cria automaticamente as tabelas no início
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Aplica os mesmos pipes globais que sua aplicação principal usa (ex: ValidationPipe)
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Pega a instância do repositório para poder limpar o banco entre os testes
    userRepository = moduleFixture.get('UserRepository');
  });

  // `beforeEach` é executado antes de cada teste (`it`)
  beforeEach(async () => {
    // Limpa a tabela de usuários para garantir que cada teste comece com o banco limpo
    await userRepository.clear();
  });

  // `afterAll` é executado uma vez após todos os testes
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

    it('should return a Bad Request if email is already in use', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'StrongPassword123!',
        name: 'Test User',
      };
      // Cria o usuário pela primeira vez
      await userRepository.save(registerDto);

      // Tenta registrar com o mesmo e-mail
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login a registered user and return an access token', async () => {
      const user = {
        email: 'login@example.com',
        password: 'StrongPassword123!',
        name: 'Login User',
      };

      // 1. Primeiro, registra um usuário usando o endpoint de registro
      await request(app.getHttpServer()).post('/auth/register').send(user);

      // 2. Agora, tenta fazer o login com as credenciais corretas
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
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
