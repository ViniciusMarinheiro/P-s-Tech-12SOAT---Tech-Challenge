import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UserRepositoryPort } from './repositories/port/user.repository.port';
import { UserRole } from '../auth/enums/user-role.enum';

describe ('UserService', () => {
    let usersService: UsersService;
    let userRepository: UserRepositoryPort;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: UserRepositoryPort,
                    useValue: {
                        findByEmail: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        findAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        userRepository = module.get<UserRepositoryPort>(UserRepositoryPort);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
    });


     it('should find user by email', async () => {
        const email = 'test@example.com';
        const user = { id: 1, email: 'test@example.com', name: 'Test User' };

        userRepository.findByEmail = jest.fn().mockResolvedValue(user);

        const result = await usersService.findByEmail(email);

        expect(result).toEqual(user);
        expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it('should find user by id', async () => {
        const id = 1;
        const user = { id: 1, email: 'test@example.com', name: 'Test User' };

        userRepository.findById = jest.fn().mockResolvedValue(user);

        const result = await usersService.findById(id);

        expect(result).toEqual(user);
        expect(userRepository.findById).toHaveBeenCalledWith(id);
    });

    it('should create a user', async () => {
        const createUserDto = { email: 'test@example.com', name: 'Test User', role: UserRole.CUSTOMER, password: 'password123' };
        const user = { id: 1, email: 'test@example.com', name: 'Test User' };

        userRepository.create = jest.fn().mockResolvedValue(user);

        const result = await usersService.create(createUserDto);

        expect(result).toEqual(user);
        expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should update a user', async () => {
        const id = 1;
        const updateUserDto = { name: 'Updated User' };
        const updatedUser = { id: 1, email: 'test@example.com', name: 'Updated User' };

        userRepository.update = jest.fn().mockResolvedValue(updatedUser);
        userRepository.findById = jest.fn().mockResolvedValue(updatedUser);

        const result = await usersService.update(id, updateUserDto);

        expect(result).toEqual(updatedUser);
        expect(userRepository.update).toHaveBeenCalledWith(id, updateUserDto);
    });

    it('should delete a user', async () => {
        const id = 1;
        const user = { id: 1, email: 'test@example.com', name: 'Test User' };

        userRepository.findById = jest.fn().mockResolvedValue(user);
        userRepository.delete = jest.fn().mockResolvedValue(undefined);

        await usersService.delete(id);

        expect(userRepository.findById).toHaveBeenCalledWith(id);
        expect(userRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should find all users', async () => {
        const users = [
            { id: 1, email: 'test@example.com', name: 'Test User' },
            { id: 2, email: 'test2@example.com', name: 'Test User 2' },
        ];

        userRepository.findAll = jest.fn().mockResolvedValue(users);

        const result = await usersService.findAll();

        expect(result).toEqual(users);
        expect(userRepository.findAll).toHaveBeenCalled();
    });
});
