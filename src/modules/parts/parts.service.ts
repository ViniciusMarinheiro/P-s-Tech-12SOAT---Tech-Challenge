import { Injectable } from '@nestjs/common'
import { CreatePartDto } from './dto/create-part.dto'
import { UpdatePartDto } from './dto/update-part.dto'
import { PartRepositoryPort } from './repositories/port/part.repository.port'
import { PartResponseDto } from './dto/part-response.dto'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { convertToMoney } from '@/common/utils/convert-to-money'

@Injectable()
export class PartsService {
  constructor(private readonly partRepository: PartRepositoryPort) {}

  async create(createPartDto: CreatePartDto): Promise<PartResponseDto> {
    await this.checkPartExists(createPartDto)
    return await this.partRepository.create(createPartDto)
  }

  async findAll(): Promise<PartResponseDto[]> {
    const parts = await this.partRepository.findAll()
    return parts.map((part) => ({
      ...part,
      unitPrice: convertToMoney(part.unitPrice),
    }))
  }

  async findOne(id: number): Promise<PartResponseDto> {
    const part = await this.partRepository.findOne(id)
    if (!part) {
      throw new CustomException(ErrorMessages.PART.NOT_FOUND)
    }
    return {
      ...part,
      unitPrice: convertToMoney(part.unitPrice),
    }
  }

  async update(
    id: number,
    updatePartDto: UpdatePartDto,
  ): Promise<PartResponseDto> {
    await this.checkPartExists(
      {
        name: updatePartDto.name || '',
        description: updatePartDto.description || '',
        stock: updatePartDto.stock || 0,
        unitPrice: updatePartDto.unitPrice || 0,
      },
      id,
    )
    return await this.partRepository.update(id, updatePartDto)
  }

  private async checkPartExists(
    createPartDto: CreatePartDto,
    id?: number,
  ): Promise<void> {
    const existsCheck = await this.partRepository.exists(createPartDto.name, id)

    if (existsCheck.exists) {
      const fieldName = existsCheck.field === 'name' ? 'nome' : 'campo'
      throw new CustomException(`${fieldName} já está sendo usado`)
    }
  }
}
