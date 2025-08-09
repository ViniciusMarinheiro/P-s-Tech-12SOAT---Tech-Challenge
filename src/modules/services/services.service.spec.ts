import { Test, TestingModule } from '@nestjs/testing'
import { ServicesService } from './services.service'
import { ServiceRepositoryPort } from './repositories/port/service.repository.port';
import { exists } from 'fs';

describe ('ServicesService', () => {
    let servicesService: ServicesService;
    let serviceRepository: ServiceRepositoryPort;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ServicesService,
                {
                    provide: ServiceRepositoryPort,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                        exists: jest.fn(),
                    },
                },
            ],
        }).compile();

        servicesService = module.get<ServicesService>(ServicesService);
        serviceRepository = module.get<ServiceRepositoryPort>(ServiceRepositoryPort);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(servicesService).toBeDefined();
    });

    it('should create a service', async () => {
        const createServiceDto = { name: 'Service A', description: 'Description A', price: 100 };
        const createdService = { id: 1, ...createServiceDto };

        serviceRepository.create = jest.fn().mockResolvedValue(createdService);
        serviceRepository.exists = jest.fn().mockResolvedValue(false);

        const result = await servicesService.create(createServiceDto);
        expect(result).toEqual(createdService);
    });

    it('should find all services', async () => {
        const services = [
            { id: 1, name: 'Service A', price: 100 },
            { id: 2, name: 'Service B', price: 200 },
        ];

        serviceRepository.findAll = jest.fn().mockResolvedValue(services);

        const result = await servicesService.findAll();
        expect(result[0].name).toEqual(services[0].name);
        expect(result[1].name).toEqual(services[1].name);
    });

    it('should find one service by id', async () => {
        const service = { id: 1, name: 'Service A', price: 100 };

        serviceRepository.findOne = jest.fn().mockResolvedValue(service);

        const result = await servicesService.findOne(1);
        expect(result.name).toEqual(service.name);
    });

    it('should throw an error if service not found', async () => {
        serviceRepository.findOne = jest.fn().mockResolvedValue(null);

        await expect(servicesService.findOne(1)).rejects.toThrow('Serviço não encontrado');
    });

    it('should update a service', async () => {
        const updateServiceDto = { name: 'Service A Updated', description: 'Description A Updated', price: 150 };
        const updatedService = { id: 1, ...updateServiceDto };

        serviceRepository.update = jest.fn().mockResolvedValue(updatedService);
        serviceRepository.exists = jest.fn().mockResolvedValue(false);

        const result = await servicesService.update(1, updateServiceDto);
        expect(result).toEqual(updatedService);
    });

});
