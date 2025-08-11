import { Injectable, NotFoundException } from '@nestjs/common'
import { WorkOrderRepositoryPort } from './repositories/port/work-order.repository.port'
import { CreateWorkOrderDto } from './dto/create-work-order.dto'
import { UpdateWorkOrderDto } from './dto/update-work-order.dto'
import { WorkOrderResponseDto } from './dto/work-order-response.dto'
import { WorkOrderStatusEnum } from './enum/work-order-status.enum'
import { CustomException } from '@/common/exceptions/customException'
import { ErrorMessages } from '@/common/constants/errorMessages'
import { VehiclesService } from '../vehicles/vehicles.service'
import { CustomersService } from '../customers/customers.service'
import { ServicesService } from '../services/services.service'
import { PartsService } from '../parts/parts.service'
import { convertToCents } from '@/common/utils/convert-to-cents'
import { WorkOrderFilterDto } from './dto/work-order-filter.dto'
import { SendEmailQueueProvider } from '@/providers/email/job/send-email-queue/send-email-queue.provider'
import { EnvConfigService } from '@/common/service/env/env-config.service'

@Injectable()
export class WorkOrdersService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepositoryPort,
    private readonly vehiclesService: VehiclesService,
    private readonly customersService: CustomersService,
    private readonly servicesService: ServicesService,
    private readonly partsService: PartsService,
    private readonly sendEmailQueueProvider: SendEmailQueueProvider,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async create(
    createWorkOrderDto: CreateWorkOrderDto,
    userId: number,
  ): Promise<void> {
    await this.validateCustomerAndVehicle(
      createWorkOrderDto.customerId,
      createWorkOrderDto.vehicleId,
    )

    let totalAmount = 0

    if (createWorkOrderDto.services) {
      for (const serviceDto of createWorkOrderDto.services) {
        const service = await this.servicesService.findOne(serviceDto.serviceId)

        serviceDto.price = convertToCents(service.price) * serviceDto.quantity
        totalAmount += serviceDto.price
      }
    }

    if (createWorkOrderDto.parts) {
      for (const partDto of createWorkOrderDto.parts) {
        const part = await this.partsService.findOne(partDto.partId)
        partDto.price = convertToCents(part.unitPrice) * partDto.quantity
        totalAmount += partDto.price
      }
    }

    await this.workOrderRepository.create(
      {
        ...createWorkOrderDto,
        userId,
      },
      totalAmount,
    )

    return
  }

  async findById(id: number): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findById(id)
    if (!workOrder) {
      throw new NotFoundException(
        ErrorMessages.WORK_ORDER?.NOT_FOUND?.(id) ||
          `Ordem de serviço com ID ${id} não encontrada`,
      )
    }
    return workOrder
  }

  async findByCustomerId(customerId: number): Promise<WorkOrderResponseDto[]> {
    return await this.workOrderRepository.findByCustomerId(customerId)
  }

  async findByCustomerDocument(
    document: string,
  ): Promise<WorkOrderResponseDto[]> {
    return await this.workOrderRepository.findByCustomerDocument(document)
  }

  async findByVehicleId(vehicleId: number): Promise<WorkOrderResponseDto[]> {
    return await this.workOrderRepository.findByVehicleId(vehicleId)
  }

  async findByStatus(status: string): Promise<WorkOrderResponseDto[]> {
    return await this.workOrderRepository.findByStatus(status)
  }

  async update(
    id: number,
    updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<void> {
    const currentWorkOrder = await this.workOrderRepository.findById(id)
    if (!currentWorkOrder) {
      throw new CustomException(
        ErrorMessages.WORK_ORDER?.NOT_FOUND?.(id) ||
          `Ordem de serviço com ID ${id} não encontrada`,
      )
    }

    if (currentWorkOrder.status !== WorkOrderStatusEnum.RECEIVED) {
      throw new CustomException(
        'Apenas ordens com status RECEIVED podem ser editadas',
      )
    }

    if (updateWorkOrderDto.parts) {
      await this.managePartsStock(
        id,
        currentWorkOrder.parts,
        updateWorkOrderDto.parts,
      )
    }

    if (updateWorkOrderDto.services) {
      await this.updateWorkOrderServices(id, updateWorkOrderDto.services)
    }

    if (updateWorkOrderDto.parts) {
      await this.updateWorkOrderParts(id, updateWorkOrderDto.parts)
    }

    await this.recalculateTotalAmount(id)

    await this.findById(id)
  }

  async delete(id: number): Promise<void> {
    await this.findById(id)

    return this.workOrderRepository.delete(id)
  }

  async findAll(
    workOrderFilterDto: WorkOrderFilterDto,
  ): Promise<WorkOrderResponseDto[]> {
    return await this.workOrderRepository.findAll(workOrderFilterDto)
  }

  async updateStatus(id: number, status: WorkOrderStatusEnum): Promise<void> {
    const workOrder = await this.findById(id)

    await this.validateStatusTransition(id, status)

    if (status === WorkOrderStatusEnum.FINISHED) {
      await this.sendEmailQueueProvider.execute({
        recipient: workOrder.customer.email,
        subject: `Ordem de serviço ${workOrder.id} - Finalizada`,
        body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #27ae60; margin-bottom: 20px; text-align: center; border-bottom: 3px solid #27ae60; padding-bottom: 10px;">
              🎉 Ordem de Serviço #${workOrder.id} - Finalizada!
            </h2>
            
            <div style="background-color: #d5f4e6; padding: 20px; border-radius: 6px; margin-bottom: 25px; text-align: center;">
              <p style="color: #27ae60; font-size: 18px; font-weight: bold; margin: 0;">
                ✅ Seu veículo está pronto para retirada!
              </p>
            </div>
            
            <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              A ordem de serviço foi finalizada com sucesso. Seu veículo está pronto e pode ser retirado no local.
            </p>
            
            <div style="background-color: #ecf0f1; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">📋 Detalhes da Ordem</h3>
              <p style="margin: 10px 0; color: #34495e;"><strong>Número da Ordem:</strong> #${workOrder.id}</p>
              <p style="margin: 10px 0; color: #34495e;"><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">Finalizada</span></p>
              <p style="margin: 10px 0; color: #34495e;"><strong>Valor Total:</strong> R$ ${workOrder.totalAmount}</p>
            </div>
            
            <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
              <h3 style="margin: 0 0 10px 0; font-size: 18px;">🚗 Próximos Passos</h3>
              <p style="margin: 0; font-size: 16px;">Dirija-se ao local para retirar seu veículo</p>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px; text-align: center; margin-top: 25px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
              Obrigado por escolher nossos serviços! 🚀
            </p>
          </div>
        </div>
        `,
      })
    }

    if (status === WorkOrderStatusEnum.IN_PROGRESS) {
      await Promise.all([
        this.sendEmailQueueProvider.execute({
          recipient: workOrder.customer.email,
          subject: `Ordem de serviço ${workOrder.id} - Em andamento`,
          body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #f39c12; margin-bottom: 20px; text-align: center; border-bottom: 3px solid #f39c12; padding-bottom: 10px;">
                🔧 Ordem de Serviço #${workOrder.id} - Em Andamento
              </h2>
              
              <div style="background-color: #fef9e7; padding: 20px; border-radius: 6px; margin-bottom: 25px; text-align: center;">
                <p style="color: #f39c12; font-size: 18px; font-weight: bold; margin: 0;">
                  ⚡ Trabalho iniciado com sucesso!
                </p>
              </div>
              
              <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                Sua ordem de serviço foi confirmada e está sendo executada. Nossa equipe está trabalhando para entregar o melhor resultado.
              </p>
              
              <div style="background-color: #ecf0f1; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">📊 Status Atual</h3>
                <p style="margin: 10px 0; color: #34495e;"><strong>Número da Ordem:</strong> #${workOrder.id}</p>
                <p style="margin: 10px 0; color: #34495e;"><strong>Status:</strong> <span style="color: #f39c12; font-weight: bold;">Em Andamento</span></p>
                <p style="margin: 10px 0; color: #34495e;"><strong>Valor Total:</strong> R$ ${workOrder.totalAmount}</p>
              </div>
              
              <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">⏰ Acompanhamento</h3>
                <p style="margin: 0; font-size: 16px;">Você será notificado automaticamente quando o serviço for finalizado</p>
              </div>
              
              <p style="color: #7f8c8d; font-size: 14px; text-align: center; margin-top: 25px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
                Estamos trabalhando para você! 🚗💨
              </p>
            </div>
          </div>
          `,
        }),
        this.sendEmailQueueProvider.execute({
          recipient: workOrder.user.email,
          subject: `Ordem de serviço ${workOrder.id} - Confirmada`,
          body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #3498db; margin-bottom: 20px; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
                📋 Ordem de Serviço #${workOrder.id} - Confirmada
              </h2>
              
              <div style="background-color: #ebf3fd; padding: 20px; border-radius: 6px; margin-bottom: 25px; text-align: center;">
                <p style="color: #3498db; font-size: 18px; font-weight: bold; margin: 0;">
                  ✅ Ordem aprovada pelo cliente!
                </p>
              </div>
              
              <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                A ordem de serviço foi confirmada pelo cliente e está em andamento. Você pode prosseguir com a execução dos serviços.
              </p>
              
              <div style="background-color: #ecf0f1; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">📊 Detalhes da Ordem</h3>
                <p style="margin: 10px 0; color: #34495e;"><strong>Número da Ordem:</strong> #${workOrder.id}</p>
                <p style="margin: 10px 0; color: #34495e;"><strong>Cliente:</strong> ${workOrder.customer.name}</p>
                <p style="margin: 10px 0; color: #34495e;"><strong>Veículo:</strong> Placa ${workOrder.vehicle.plate}</p>
                <p style="margin: 10px 0; color: #34495e;"><strong>Status:</strong> <span style="color: #3498db; font-weight: bold;">Em Andamento</span></p>
              </div>
              
              <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">🚀 Próximos Passos</h3>
                <p style="margin: 0; font-size: 16px;">Execute os serviços conforme especificado na ordem</p>
              </div>
              
              <p style="color: #7f8c8d; font-size: 14px; text-align: center; margin-top: 25px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
                Bom trabalho! 💪🔧
              </p>
            </div>
          </div>
          `,
        }),
      ])
    }

    if (
      workOrder.status === WorkOrderStatusEnum.DIAGNOSING &&
      status === WorkOrderStatusEnum.AWAITING_APPROVAL
    ) {
      await this.sendEmailQueueProvider.execute({
        recipient: workOrder.customer.email,
        subject: `Ordem de serviço ${workOrder.id} - Aguardando aprovação`,
        body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50; margin-bottom: 20px; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
              🚗 Ordem de Serviço #${workOrder.id} - Aguardando Aprovação
            </h2>
            
            <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              A ordem de serviço foi diagnosticada com sucesso e agora está aguardando sua aprovação para prosseguir com a execução.
            </p>
            
            <div style="background-color: #ecf0f1; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">📋 Resumo dos Serviços</h3>
              ${workOrder.services
                .map(
                  (service) => `
                <div style="margin-bottom: 10px; padding: 10px; background-color: #ffffff; border-left: 4px solid #3498db; border-radius: 4px;">
                  <strong>${service.serviceName}</strong><br>
                  <span style="color: #7f8c8d;">Quantidade: ${service.quantity} | Preço: R$ ${service.totalPrice}</span>
                </div>
              `,
                )
                .join('')}
            </div>
            
            <div style="background-color: #ecf0f1; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">🔧 Peças Utilizadas</h3>
              ${workOrder.parts
                .map(
                  (part) => `
                <div style="margin-bottom: 10px; padding: 10px; background-color: #ffffff; border-left: 4px solid #e74c3c; border-radius: 4px;">
                  <strong>${part.partName}</strong><br>
                  <span style="color: #7f8c8d;">Quantidade: ${part.quantity} | Preço: R$ ${part.totalPrice}</span>
                </div>
              `,
                )
                .join('')}
            </div>
            
            <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
              <h3 style="margin: 0 0 10px 0; font-size: 20px;">💰 Valor Total</h3>
              <p style="font-size: 24px; font-weight: bold; margin: 0; color: #f39c12;">R$ ${workOrder.totalAmount}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${this.envConfigService.get('SERVER_URL_PREFIX')}/work-orders/approve/${workOrder.hashView}" 
                 style="background-color: #27ae60; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                ✅ Aprovar Ordem de Serviço
              </a>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px; text-align: center; margin-top: 25px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
              Este é um email automático. Em caso de dúvidas, entre em contato conosco.
            </p>
          </div>
        </div>
        `,
      })
    }

    if (status === WorkOrderStatusEnum.DELIVERED) {
      await this.sendEmailQueueProvider.execute({
        recipient: workOrder.customer.email,
        subject: `Ordem de serviço ${workOrder.id} - Entregue com sucesso!`,
        body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #8e44ad; margin-bottom: 20px; text-align: center; border-bottom: 3px solid #8e44ad; padding-bottom: 10px;">
              🎊 Ordem de Serviço #${workOrder.id} - Entregue!
            </h2>
            
            <div style="background-color: #f4e6f7; padding: 20px; border-radius: 6px; margin-bottom: 25px; text-align: center;">
              <p style="color: #8e44ad; font-size: 18px; font-weight: bold; margin: 0;">
                🚗✨ Seu veículo foi entregue com sucesso!
              </p>
            </div>
            
            <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              É com grande satisfação que informamos que sua ordem de serviço foi concluída e entregue com excelência. 
              Esperamos que você esteja satisfeito com o resultado do nosso trabalho.
            </p>
            
            <div style="background-color: #ecf0f1; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
              <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">📋 Resumo da Ordem</h3>
              <p style="margin: 10px 0; color: #34495e;"><strong>Número da Ordem:</strong> #${workOrder.id}</p>
              <p style="margin: 10px 0; color: #34495e;"><strong>Status:</strong> <span style="color: #8e44ad; font-weight: bold;">Entregue</span></p>
              <p style="margin: 10px 0; color: #34495e;"><strong>Valor Total:</strong> R$ ${workOrder.totalAmount}</p>
              <p style="margin: 10px 0; color: #34495e;"><strong>Data de Entrega:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
              <h3 style="margin: 0 0 15px 0; font-size: 20px;">🙏 Obrigado pela Confiança!</h3>
              <p style="margin: 0 0 15px 0; font-size: 16px;">
                Foi um prazer atendê-lo e esperamos vê-lo novamente em breve!
              </p>
              <p style="margin: 0; font-size: 14px; color: #bdc3c7;">
                Sua satisfação é nossa prioridade máxima
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 25px; text-align: center;">
              <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">⭐ Avalie Nossos Serviços</h3>
              <p style="color: #7f8c8d; font-size: 14px; margin-bottom: 15px;">
                Sua opinião é muito importante para nós continuarmos melhorando
              </p>
              <p style="color: #34495e; font-size: 16px; font-weight: bold;">
                Recomende-nos aos seus amigos e familiares!
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                <strong>Equipe de Atendimento</strong><br>
                Estamos sempre à disposição para ajudá-lo
              </p>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px; text-align: center; margin-top: 25px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
              Obrigado por escolher nossos serviços! 🚀💜
            </p>
          </div>
        </div>
        `,
      })
    }

    await this.workOrderRepository.updateStatus(id, status)
  }

  async findByHashView(hashView: string): Promise<WorkOrderResponseDto> {
    const workOrder = await this.workOrderRepository.findByHashView(hashView)
    if (!workOrder) {
      throw new CustomException(
        `Ordem de serviço não encontrada, verifique se o hash de visualização está correto`,
      )
    }
    return workOrder
  }

  async approveHashView(hashView: string): Promise<void> {
    const workOrder = await this.findByHashView(hashView)
    try {
      await this.updateStatus(workOrder.id, WorkOrderStatusEnum.IN_PROGRESS)
    } catch (error) {
      throw new CustomException(
        `Erro ao aprovar ordem de serviço, você já aprovou está ordem de serviço`,
      )
    }
  }

  async getWorkOrderProgress(id: number): Promise<{
    id: number
    status: WorkOrderStatusEnum
    statusDescription: string
    progress: number
    estimatedCompletion?: Date
  }> {
    const workOrder = await this.findById(id)

    const statusProgress = {
      [WorkOrderStatusEnum.RECEIVED]: 10,
      [WorkOrderStatusEnum.DIAGNOSING]: 30,
      [WorkOrderStatusEnum.AWAITING_APPROVAL]: 50,
      [WorkOrderStatusEnum.IN_PROGRESS]: 70,
      [WorkOrderStatusEnum.FINISHED]: 90,
      [WorkOrderStatusEnum.DELIVERED]: 100,
    }

    const statusDescriptions = {
      [WorkOrderStatusEnum.RECEIVED]: 'Ordem recebida',
      [WorkOrderStatusEnum.DIAGNOSING]: 'Em diagnóstico',
      [WorkOrderStatusEnum.AWAITING_APPROVAL]: 'Aguardando aprovação',
      [WorkOrderStatusEnum.IN_PROGRESS]: 'Em execução',
      [WorkOrderStatusEnum.FINISHED]: 'Finalizada',
      [WorkOrderStatusEnum.DELIVERED]: 'Entregue',
    }

    return {
      id: workOrder.id,
      status: workOrder.status,
      statusDescription: statusDescriptions[workOrder.status],
      progress: statusProgress[workOrder.status],
    }
  }

  private async validateStatusTransition(
    id: number,
    newStatus: WorkOrderStatusEnum,
  ): Promise<void> {
    const workOrder = await this.findById(id)
    const currentStatus = workOrder.status

    const validTransitions: Record<WorkOrderStatusEnum, WorkOrderStatusEnum[]> =
      {
        [WorkOrderStatusEnum.RECEIVED]: [WorkOrderStatusEnum.DIAGNOSING],
        [WorkOrderStatusEnum.DIAGNOSING]: [
          WorkOrderStatusEnum.AWAITING_APPROVAL,
        ],
        [WorkOrderStatusEnum.AWAITING_APPROVAL]: [
          WorkOrderStatusEnum.IN_PROGRESS,
        ],
        [WorkOrderStatusEnum.IN_PROGRESS]: [WorkOrderStatusEnum.FINISHED],
        [WorkOrderStatusEnum.FINISHED]: [WorkOrderStatusEnum.DELIVERED],
        [WorkOrderStatusEnum.DELIVERED]: [],
      }

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new CustomException(
        `Transição de status inválida: ${currentStatus} -> ${newStatus}`,
      )
    }
  }

  private async validateCustomerAndVehicle(
    customerId: number,
    vehicleId: number,
  ): Promise<void> {
    const customer = await this.customersService.findOne(customerId)
    const vehicle = await this.vehiclesService.findOne(vehicleId)

    if (!customer) {
      throw new CustomException(ErrorMessages.CUSTOMER.NOT_FOUND(customerId))
    }

    if (!vehicle) {
      throw new CustomException(ErrorMessages.VEHICLE.NOT_FOUND(vehicleId))
    }

    if (customer.id !== vehicle.customerId) {
      throw new CustomException('Cliente e veículo não correspondem')
    }
  }

  private async managePartsStock(
    workOrderId: number,
    currentParts: any[],
    newParts: any[],
  ): Promise<void> {
    // Mapear peças atuais por ID
    const currentPartsMap = new Map(
      currentParts.map((part) => [part.partId, part.quantity]),
    )

    // Mapear novas peças por ID
    const newPartsMap = new Map(
      newParts.map((part) => [part.partId, part.quantity]),
    )

    // Para cada peça, calcular a diferença e atualizar estoque
    for (const [partId, newQuantity] of newPartsMap) {
      const currentQuantity = currentPartsMap.get(partId) || 0
      const difference = newQuantity - currentQuantity

      if (difference !== 0) {
        const part = await this.partsService.findOne(partId)
        if (!part) {
          throw new CustomException(`Peça com ID ${partId} não encontrada`)
        }

        // Se está removendo peças, adicionar ao estoque
        if (difference < 0) {
          await this.partsService.update(partId, {
            stock: part.stock + Math.abs(difference),
          })
        }
        // Se está adicionando peças, verificar se há estoque suficiente
        else {
          if (part.stock < difference) {
            throw new CustomException(
              `Estoque insuficiente para a peça ${part.name}. Disponível: ${part.stock}, Necessário: ${difference}`,
            )
          }
          await this.partsService.update(partId, {
            stock: part.stock - difference,
          })
        }
      }
    }

    // Remover peças que não estão mais na lista
    for (const [partId, currentQuantity] of currentPartsMap) {
      if (!newPartsMap.has(partId)) {
        const part = await this.partsService.findOne(partId)
        if (part) {
          await this.partsService.update(partId, {
            stock: part.stock + currentQuantity,
          })
        }
      }
    }
  }

  private async updateWorkOrderServices(
    workOrderId: number,
    services: any[],
  ): Promise<void> {
    // Remover todos os serviços atuais
    await this.workOrderRepository.removeWorkOrderServices(workOrderId)

    // Adicionar novos serviços
    for (const service of services) {
      const serviceData = await this.servicesService.findOne(service.serviceId)
      if (!serviceData) {
        throw new CustomException(
          `Serviço com ID ${service.serviceId} não encontrado`,
        )
      }

      await this.workOrderRepository.addWorkOrderService(workOrderId, {
        serviceId: service.serviceId,
        quantity: service.quantity,
        totalPrice: convertToCents(serviceData.price) * service.quantity,
      })
    }
  }

  private async updateWorkOrderParts(
    workOrderId: number,
    parts: any[],
  ): Promise<void> {
    // Remover todas as peças atuais
    await this.workOrderRepository.removeWorkOrderParts(workOrderId)

    // Adicionar novas peças
    for (const part of parts) {
      const partData = await this.partsService.findOne(part.partId)
      if (!partData) {
        throw new CustomException(`Peça com ID ${part.partId} não encontrada`)
      }

      await this.workOrderRepository.addWorkOrderPart(workOrderId, {
        partId: part.partId,
        quantity: part.quantity,
        totalPrice: convertToCents(partData.unitPrice) * part.quantity,
      })
    }
  }

  private async recalculateTotalAmount(workOrderId: number): Promise<void> {
    const workOrder = await this.findById(workOrderId)

    const servicesTotal = workOrder.services.reduce((acc, service) => {
      return acc + service.totalPrice
    }, 0)

    const partsTotal = workOrder.parts.reduce((acc, part) => {
      return acc + part.totalPrice
    }, 0)

    const totalAmount = servicesTotal + partsTotal

    await this.workOrderRepository.update(workOrderId, {
      totalAmount: convertToCents(totalAmount),
    } as any)
  }
}
