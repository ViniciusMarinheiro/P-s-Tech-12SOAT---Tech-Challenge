import 'crypto'
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { Customer } from '../src/modules/customers/entities/customer.entity';
import { UserRole } from '../src/modules/auth/enums/user-role.enum';
import { CreateCustomerDto } from '../src/modules/customers/dto/create-customer.dto';
import * as bcrypt from 'bcryptjs'

describe('CustomersController (E2E)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let customerRepository: Repository<Customer>;
  let jwtTokenAdmin: string;
  let jwtTokenCustomer: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get('UserRepository');
    customerRepository = moduleFixture.get('CustomerRepository');

    const hashedPassword = await bcrypt.hash('StrongPassword123', 10)
    userRepository.save({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Customer User',
        email: 'user@test.com',
        password: 'password123',
      });
    const loginResponseAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'StrongPassword123',
      });
    jwtTokenAdmin = loginResponseAdmin.body.access_token;

    const loginResponseCustomer = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'password123',
      });
    jwtTokenCustomer = loginResponseCustomer.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/customers (POST)', () => {
    const createCustomerDto: CreateCustomerDto = {
      name: 'Test Customer',
      email: 'customer@test.com',
      documentNumber: '11122233344',
    };

    it('should create a customer when user is authenticated and authorized', async () => {
      return request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${jwtTokenAdmin}`)
        .send(createCustomerDto)
        .expect(HttpStatus.CREATED)
        .then((response) => {
          expect(response.body).toEqual({
            id: expect.any(Number),
            ...createCustomerDto,
            phone: null,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        });
    });

    it('should return 401 Unauthorized if no token is provided', () => {
      return request(app.getHttpServer())
        .post('/customers')
        .send(createCustomerDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 403 Forbidden if user is not authorized', async () => {
      return request(app.getHttpServer())
        .post('/customers')
        .set('Authorization', `Bearer ${jwtTokenCustomer}`)
        .send(createCustomerDto)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('/customers (GET)', () => {
    it('should return a list of customers when user is authenticated', async () => {
      await customerRepository.save({
        name: 'Last Customer',
        email: 'last@test.com',
        documentNumber: '123456',
      });

      return request(app.getHttpServer())
        .get('/customers')
        .set('Authorization', `Bearer ${jwtTokenAdmin}`)
        .expect(HttpStatus.OK)
        .then((response) => {
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBe(2);
          expect(response.body[1].name).toBe('Last Customer');
        });
    });

    it('should return 401 Unauthorized if no token is provided', () => {
      return request(app.getHttpServer())
        .get('/customers')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    // it('should return 403 Forbidden if user is not authorized', async () => {
    //   return request(app.getHttpServer())
    //     .get('/customers')
    //     .set('Authorization', `Bearer ${jwtTokenCustomer}`)
    //     .expect(HttpStatus.FORBIDDEN);
    // });
  });
});
