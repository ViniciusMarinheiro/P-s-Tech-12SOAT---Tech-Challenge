import { Injectable, Logger } from '@nestjs/common'
import { PartRepositoryPort } from '../../domain/repositories/part.repository.port'
import { PartDomain } from '../../domain/entities/part.entity'
import { convertToMoney } from '@/common/utils/convert-to-money'

@Injectable()
export class ListPartsUseCase {
  private readonly logger = new Logger(ListPartsUseCase.name)

  constructor(private readonly repo: PartRepositoryPort) {}

  async execute(): Promise<PartDomain[]> {
    this.logger.log('Listando peças')
    const parts = await this.repo.findAll()
    this.logger.log('Peças listadas com sucesso', { count: parts.length })
    return parts
  }
}
