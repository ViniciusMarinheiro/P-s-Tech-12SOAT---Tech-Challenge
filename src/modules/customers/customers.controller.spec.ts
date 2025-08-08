import { Test, TestingModule } from '@nestjs/testing'
import { CustomersController } from './customers.controller'
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Customer } from './entities/customer.entity'
import { DocumentType } from '../auth/enums/document-type.enum'

describe('CustomersController', () => {
  let controller: CustomersController
  let service: jest.Mocked<CustomersService>

  const mockCustomer: Customer = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    documentNumber: '12345678900',
    phone: '11999999999',
    vehicles: [],
    workOrders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<CustomersController>(CustomersController)
    service = module.get(CustomersService)
  })

  describe('create', () => {
    it('should create and return a customer', async () => {
      const dto: CreateCustomerDto = { 
        name: 'John Doe', 
        email: 'john@example.com',
        document_type: DocumentType.CPF,
        documentNumber: '12345678900'
      }
      service.create.mockResolvedValue(mockCustomer)

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(result).toEqual(mockCustomer)
    })
  })

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      service.findAll.mockResolvedValue([mockCustomer])

      const result = await controller.findAll()

      expect(service.findAll).toHaveBeenCalled()
      expect(result).toEqual([mockCustomer])
    })
  })

  describe('findOne', () => {
    it('should return a single customer by ID', async () => {
      service.findOne.mockResolvedValue(mockCustomer)

      const result = await controller.findOne(1)

      expect(service.findOne).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockCustomer)
    })

    it('should throw if customer is not found', async () => {
      service.findOne.mockRejectedValue(new Error('Customer not found'))

      await expect(controller.findOne(99)).rejects.toThrow('Customer not found')
      expect(service.findOne).toHaveBeenCalledWith(99)
    })
  })

  describe('update', () => {
    it('should update and return the customer', async () => {
      const dto: UpdateCustomerDto = { name: 'Updated Name' }
      const updatedCustomer = { ...mockCustomer, ...dto }
      service.update.mockResolvedValue(updatedCustomer)

      const result = await controller.update(1, dto)

      expect(service.update).toHaveBeenCalledWith(1, dto)
      expect(result).toEqual(updatedCustomer)
    })

    it('should throw if customer to update is not found', async () => {
      service.update.mockRejectedValue(new Error('Customer not found'))

      await expect(controller.update(99, { name: 'Test' })).rejects.toThrow('Customer not found')
    })
  })

  describe('remove', () => {
    it('should call service.remove and return void', async () => {
      service.remove.mockResolvedValue(undefined)

      await controller.remove(1)

      expect(service.remove).toHaveBeenCalledWith(1)
    })

    it('should throw if customer to delete is not found', async () => {
      service.remove.mockRejectedValue(new Error('Customer not found'))

      await expect(controller.remove(99)).rejects.toThrow('Customer not found')
    })
  })
})
