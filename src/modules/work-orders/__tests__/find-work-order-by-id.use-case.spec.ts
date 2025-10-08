import { Test } from '@nestjs/testing'
import { FindWorkOrderByIdUseCase } from '../application/use-cases/find-work-order-by-id.use-case'
import { WorkOrderRepositoryPort } from '../domain/repositories/work-order.repository.port'
import { NotFoundException } from '@nestjs/common'

describe('FindWorkOrderByIdUseCase', () => {
  it('should throw NotFound when missing', async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindWorkOrderByIdUseCase,
        {
          provide: WorkOrderRepositoryPort,
          useValue: { findById: jest.fn().mockResolvedValue(null) },
        },
      ],
    }).compile()

    const uc = module.get(FindWorkOrderByIdUseCase)
    await expect(uc.execute(123)).rejects.toBeInstanceOf(NotFoundException)
  })
})
