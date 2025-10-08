import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { Part } from './part.entity'
import { CreatePartInput } from '../../domain/interfaces/create-part.input.interface'
import { UpdatePartInput } from '../../domain/interfaces/update-part.input.interface'
import { PartRepositoryPort } from '../../domain/repositories/part.repository.port'
import { PartDomain } from '../../domain/entities/part.entity'
import { PartMapper } from '../mappers/part.mapper'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { convertToCents } from '@/common/utils/convert-to-cents'

@Injectable()
export class PartRepository extends PartRepositoryPort {
  constructor(
    @InjectRepository(Part)
    private readonly repository: Repository<Part>,
  ) {
    super()
  }

  async create(createPartDto: CreatePartInput): Promise<PartDomain> {
    const part = this.repository.create({
      ...createPartDto,
      unitPrice: convertToCents(createPartDto.unitPrice),
      stock: createPartDto.stock || 0,
    })
    const savedPart = await this.repository.save(part)

    if (!savedPart) {
      throw new CustomException(ErrorMessages.PART.NOT_FOUND)
    }

    return PartMapper.toDomain(savedPart)
  }

  async findAll(): Promise<PartDomain[]> {
    const parts = await this.repository.find()
    return parts.map(PartMapper.toDomain)
  }

  async findOne(id: number): Promise<PartDomain | null> {
    const part = await this.repository.findOne({
      where: { id },
    })
    return part ? PartMapper.toDomain(part) : null
  }

  async findByName(name: string): Promise<PartDomain | null> {
    const part = await this.repository.findOne({
      where: { name },
    })
    return part ? PartMapper.toDomain(part) : null
  }

  async update(
    id: number,
    updatePartDto: UpdatePartInput,
  ): Promise<PartDomain> {
    await this.repository.update(id, {
      ...updatePartDto,
      ...(updatePartDto.unitPrice && {
        unitPrice: convertToCents(updatePartDto.unitPrice),
      }),
    })
    const updatedPart = await this.repository.findOne({ where: { id } })

    if (!updatedPart) {
      throw new CustomException(ErrorMessages.PART.NOT_FOUND)
    }

    return PartMapper.toDomain(updatedPart)
  }

  async exists(
    name?: string,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }> {
    if (name) {
      const existingPart = await this.repository.findOne({
        where: { name, id: Not(id || 0) },
      })

      if (existingPart) {
        return { exists: true, field: 'name', value: name }
      }
    }

    return { exists: false }
  }
}
