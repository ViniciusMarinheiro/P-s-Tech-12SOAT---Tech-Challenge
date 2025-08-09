import { Test, TestingModule } from '@nestjs/testing'
import { CustomersService } from './customers.service'
import { CustomerRepository } from './repositories/customer.repository';

describe ('CustomerServicer', () => {
    let customerRepository: any;
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            providers: [
                {
                    provide: 'CustomerRepository',
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        findOneByDocument: jest.fn(),
                        update: jest.fn(),
                        exists: jest.fn(),
                    },
                },
            ],
        }).compile();

        customerRepository = module.get<CustomerRepository>('CustomerRepository');
    });

    it('should be defined', () => {
        expect(customerRepository).toBeDefined();
    });

    it('should create a customer', async () => {
        const service: CustomersService = new CustomersService(customerRepository);
        const createCustomerDto = { name: 'John Doe', email: 'john@example.com', documentNumber: '12345678901', };
        const createdCustomer = { id: 1, ...createCustomerDto, createdAt: new Date(), updatedAt: new Date() };

        customerRepository.exists.mockImplementationOnce(async () => {
            return { exists: false }
        })
        customerRepository.create.mockResolvedValue(createdCustomer);

        const result = await service.create(createCustomerDto);

        expect(result).toEqual(createdCustomer);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should find all customers', async () => {
            const service: CustomersService = new CustomersService(customerRepository);
            const customers = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
    
            customerRepository.findAll.mockResolvedValue(customers);
    
            const result = await service.findAll();
    
            expect(result).toEqual(customers);
    });

    it('should find one customer by id', async () => {
        const service: CustomersService = new CustomersService(customerRepository);
        const customer = { id: 1, name: 'John Doe' };

        customerRepository.findOne.mockResolvedValue(customer);

        const result = await service.findOne(1);

        expect(result).toEqual(customer);
    });

    it('should find one customer by document', async () => {
        const service: CustomersService = new CustomersService(customerRepository);
        const customer = { id: 1, name: 'John Doe', documentNumber: '12345678901' };

        customerRepository.findOneByDocument.mockResolvedValue(customer);

        const result = await service.findOneByDocument('12345678901');

        expect(result).toEqual(customer);
    });

    it('should update a customer', async () => {
        const service: CustomersService = new CustomersService(customerRepository);
        const updateCustomerDto = { name: 'John Doe Updated', email: 'john.updated@example.com', phone: '9876543210' };

        customerRepository.update.mockResolvedValue({ ...updateCustomerDto, id: 1 });
        customerRepository.exists.mockImplementationOnce(async () => {
            return { exists: false }
        })

        const result = await service.update(1, updateCustomerDto);

        expect(result).toEqual({ ...updateCustomerDto, id: 1 });
    });

    it('should throw an error if update customer with same phone number', async () => {
        const service: CustomersService = new CustomersService(customerRepository);
        const createCustomerDto = { id: 1, name: 'John Doe', email: 'john@example.com', documentNumber: '12345678901', phone: '1234567890' };

        customerRepository.exists.mockImplementationOnce(async () => {
            return { exists: true, field: 'phone', value: createCustomerDto.phone }
        })

        await expect(service.update(1, createCustomerDto)).rejects.toThrow(`telefone já está sendo usado`);
    });
});
