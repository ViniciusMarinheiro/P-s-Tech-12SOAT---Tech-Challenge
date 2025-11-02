import { Injectable } from '@nestjs/common'
import { PartRepositoryPort } from '../../domain/repositories/part.repository.port'
import { PartDomain } from '../../domain/entities/part.entity'
import { convertToMoney } from '@/common/utils/convert-to-money'

@Injectable()
export class ListPartsUseCase {
  constructor(private readonly repo: PartRepositoryPort) {}

  async execute(): Promise<PartDomain[]> {
    const parts = await this.repo.findAll()
    return parts
  }
}
