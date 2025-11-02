import { CreatePartInput } from '../interfaces/create-part.input.interface'
import { UpdatePartInput } from '../interfaces/update-part.input.interface'
import { PartDomain } from '../entities/part.entity'

export abstract class PartRepositoryPort {
  abstract create(input: CreatePartInput): Promise<PartDomain>
  abstract findAll(): Promise<PartDomain[]>
  abstract findOne(id: number): Promise<PartDomain | null>
  abstract findByName(name: string): Promise<PartDomain | null>
  abstract update(id: number, input: UpdatePartInput): Promise<PartDomain>
  abstract exists(
    name?: string,
    id?: number,
  ): Promise<{ exists: boolean; field?: string; value?: string }>
}
