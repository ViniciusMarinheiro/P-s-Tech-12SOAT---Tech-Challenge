import { Test, TestingModule } from '@nestjs/testing'
import { PartsService } from './parts.service'
import { PartRepositoryPort } from './repositories/port/part.repository.port';

describe ('PartService', () => {
    let partsService: PartsService;
    let partRepository: PartRepositoryPort;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PartsService,
                {
                    provide: PartRepositoryPort,
                    useValue: {
                        findAll: jest.fn(),
                        findById: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        partsService = module.get<PartsService>(PartsService);
        partRepository = module.get<PartRepositoryPort>(PartRepositoryPort);
    });

    afterEach(() => {
        jest.clearAllMocks();
    }); 

    it('should be defined', () => {
        expect(partsService).toBeDefined();
    });

    it('should create a part', async () => {
        const createPartDto = { name: 'Part A', description: 'Description A', stock: 10, unitPrice: 100 };
        const createdPart = { id: 1, ...createPartDto };

        partRepository.exists = jest.fn().mockResolvedValue({ exists: false });
        partRepository.create = jest.fn().mockResolvedValue(createdPart);

        const result = await partsService.create(createPartDto);
        expect(result).toEqual(createdPart);
    });

    it('should find all parts', async () => {
        const parts = [
            { id: 1, name: 'Part A', unitPrice: 10000 },
            { id: 2, name: 'Part B', unitPrice: 20000 },
        ];

        partRepository.findAll = jest.fn().mockResolvedValue(parts);

        const result = await partsService.findAll();
        expect(result).toEqual([
            { id: 1, name: 'Part A', unitPrice: 100 },
            { id: 2, name: 'Part B', unitPrice: 200 },
        ]);
    });

    it('should find one part by id', async () => {
        const part = { id: 1, name: 'Part A', unitPrice: 10000 };

        partRepository.findOne = jest.fn().mockResolvedValue(part);

        const result = await partsService.findOne(1);
        expect(result).toEqual({ id: 1, name: 'Part A', unitPrice: 100 });
    });

    it('should throw an error if part not found', async () => {
        partRepository.findOne = jest.fn().mockResolvedValue(null);

        await expect(partsService.findOne(1)).rejects.toThrow('Peça não encontrada');
    });

    it('should update a part', async () => {
        const updatePartDto = { name: 'Part A Updated', description: 'Description A Updated', stock: 20, unitPrice: 150 };
        const updatedPart = { id: 1, ...updatePartDto };

        partRepository.exists = jest.fn().mockResolvedValue({ exists: false });
        partRepository.update = jest.fn().mockResolvedValue(updatedPart);

        const result = await partsService.update(1, updatePartDto);
        expect(result).toEqual(updatedPart);
    });

    it('should throw an error if part with same name exists', async () => {
        const createPartDto = { name: 'Part A', description: 'Description A', stock: 10, unitPrice: 100 };

        partRepository.exists = jest.fn().mockResolvedValue({ exists: true });
        await expect(partsService.create(createPartDto)).rejects.toThrow('campo já está sendo usado');
    });

});
