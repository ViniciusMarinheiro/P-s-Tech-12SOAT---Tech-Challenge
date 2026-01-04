import { Injectable, Logger } from '@nestjs/common'
import { PartRepositoryPort } from '../../domain/repositories/part.repository.port'
import { UpdatePartInput } from '../../domain/interfaces/update-part.input.interface'
import { PartDomain } from '../../domain/entities/part.entity'

@Injectable()
export class UpdatePartStockUseCase {
  private readonly logger = new Logger(UpdatePartStockUseCase.name)

  constructor(private readonly repo: PartRepositoryPort) {}

  async execute(id: number, input: UpdatePartInput): Promise<PartDomain> {
    this.logger.log('Atualizando estoque da peça', { id, ...input })
    const part = await this.repo.update(id, input)
    this.logger.log('Estoque da peça atualizado com sucesso')
    return part
  }
}
