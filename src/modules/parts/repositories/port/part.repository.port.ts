import { CreatePartDto } from '../../dto/create-part.dto'
import { UpdatePartDto } from '../../dto/update-part.dto'
import { PartResponseDto } from '../../dto/part-response.dto'

export abstract class PartRepositoryPort {
  abstract create(createPartDto: CreatePartDto): Promise<PartResponseDto>
  abstract findAll(): Promise<PartResponseDto[]>
  abstract findOne(id: number): Promise<PartResponseDto | null>
  abstract findByName(name: string): Promise<PartResponseDto | null>
  abstract update(
    id: number,
    updatePartDto: UpdatePartDto,
  ): Promise<PartResponseDto>

  abstract exists(
    name?: string,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }>
}
