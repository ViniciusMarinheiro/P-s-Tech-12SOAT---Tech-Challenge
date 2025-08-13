import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { Part } from '../entities/part.entity'
import { CreatePartDto } from '../dto/create-part.dto'
import { UpdatePartDto } from '../dto/update-part.dto'
import { PartRepositoryPort } from './port/part.repository.port'
import { PartResponseDto } from '../dto/part-response.dto'
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

  async create(createPartDto: CreatePartDto): Promise<PartResponseDto> {
    const part = this.repository.create({
      ...createPartDto,
      unitPrice: convertToCents(createPartDto.unitPrice),
      stock: createPartDto.stock || 0,
    })
    const savedPart = await this.repository.save(part)

    if (!savedPart) {
      throw new CustomException(ErrorMessages.PART.NOT_FOUND)
    }

    return savedPart
  }

  async findAll(): Promise<PartResponseDto[]> {
    const parts = await this.repository.find()
    return parts
  }

  async findOne(id: number): Promise<PartResponseDto | null> {
    return await this.repository.findOne({
      where: { id },
    })
  }

  async findByName(name: string): Promise<PartResponseDto | null> {
    return await this.repository.findOne({
      where: { name },
    })
  }

  async update(
    id: number,
    updatePartDto: UpdatePartDto,
  ): Promise<PartResponseDto> {
    await this.repository.update(id, {
      ...updatePartDto,
      ...(updatePartDto.unitPrice && {
        unitPrice: convertToCents(updatePartDto.unitPrice),
      }),
    })
    const updatedPart = await this.findOne(id)

    if (!updatedPart) {
      throw new CustomException(ErrorMessages.PART.NOT_FOUND)
    }

    return updatedPart
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
