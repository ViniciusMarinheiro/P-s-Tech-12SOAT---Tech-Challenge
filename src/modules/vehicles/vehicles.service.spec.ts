import { Test, TestingModule } from '@nestjs/testing'
import { VehiclesService  } from './vehicles.service';
import { VehiclesRepositoryPort } from '../vehicles/repositories/port/vehicles.repository.port';
import { CustomersService } from '../customers/customers.service';

describe ('VehiclesService', () => {
    let vehiclesService: VehiclesService;
    let vehiclesRepository: VehiclesRepositoryPort;
    let customersService: CustomersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VehiclesService,
                {
                    provide: VehiclesRepositoryPort,
                    useValue: {
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        exists: jest.fn(),
                    },
                },
                {
                    provide: CustomersService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        vehiclesService = module.get<VehiclesService>(VehiclesService);
        vehiclesRepository = module.get<VehiclesRepositoryPort>(VehiclesRepositoryPort);
        customersService = module.get<CustomersService>(CustomersService);

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(vehiclesService).toBeDefined();
    });

    // Additional tests can be added here
    it('should create a vehicle', async () => {
        const customer = { id: 1, name: 'John Doe' };
        const createVehicleDto = { plate: 'ABC1234', customerId: 1, brand: 'Toyota', model: 'Corolla', year: 2020 };
        const createdVehicle = { id: 1, ...createVehicleDto };

        vehiclesRepository.exists = jest.fn().mockResolvedValue({ exists: false });
        vehiclesRepository.create = jest.fn().mockResolvedValue(createdVehicle);
        customersService.findOne = jest.fn().mockResolvedValue(customer);

        const result = await vehiclesService.create(createVehicleDto);
        expect(result).toEqual(createdVehicle);
    });

    it('should find all vehicles', async () => {
        const vehicles = [
            { id: 1, plate: 'ABC1234', brand: 'Toyota', model: 'Corolla', year: 2020 },
            { id: 2, plate: 'XYZ5678', brand: 'Honda', model: 'Civic', year: 2019 },
        ];

        vehiclesRepository.findAll = jest.fn().mockResolvedValue(vehicles);

        const result = await vehiclesService.findAll();
        expect(result).toEqual(vehicles);
    });

    it('should find one vehicle by id', async () => {
        const vehicle = { id: 1, plate: 'ABC1234', brand: 'Toyota', model: 'Corolla', year: 2020 };

        vehiclesRepository.findOne = jest.fn().mockResolvedValue(vehicle);

        const result = await vehiclesService.findOne(1);
        expect(result).toEqual(vehicle);
    });

    it('should update a vehicle', async () => {
        const customer = { id: 1, name: 'John Doe' };
        const updateVehicleDto = { plate: 'ABC1234', customerId: 1, brand: 'Toyota', model: 'Corolla', year: 2020 };
        const updatedVehicle = { id: 1, ...updateVehicleDto };

        vehiclesRepository.exists = jest.fn().mockResolvedValue({ exists: false });
        vehiclesRepository.update = jest.fn().mockResolvedValue(updatedVehicle);
        customersService.findOne = jest.fn().mockResolvedValue(customer);

        const result = await vehiclesService.update(1, updateVehicleDto);
        expect(result).toEqual(updatedVehicle);
    });

});
