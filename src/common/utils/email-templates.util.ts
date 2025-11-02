export interface EmailTemplateData {
  workOrderId: number
  totalAmount: number
  customerName?: string
  vehiclePlate?: string
  services?: Array<{
    serviceName: string
    quantity: number
    totalPrice: number
  }>
  parts?: Array<{
    partName: string
    quantity: number
    totalPrice: number
  }>
}

export interface EmailTemplateConfig {
  title: string
  titleColor: string
  borderColor: string
  highlightColor: string
  highlightBackgroundColor: string
  highlightText: string
  description: string
  detailsTitle: string
  details: string
  actionTitle?: string
  actionText?: string
  footerText: string
  footerEmoji: string
}

export class EmailTemplatesUtil {
  static prepareEmailTemplateData(workOrder: any): EmailTemplateData {
    return {
      workOrderId: workOrder.id,
      totalAmount: workOrder.totalAmount,
      customerName: workOrder.customer?.name,
      vehiclePlate: workOrder.vehicle?.plate,
      services: workOrder.services?.map((service: any) => ({
        serviceName: service.serviceName,
        quantity: service.quantity,
        totalPrice: service.totalPrice,
      })),
      parts: workOrder.parts?.map((part: any) => ({
        partName: part.partName,
        quantity: part.quantity,
        totalPrice: part.totalPrice,
      })),
    }
  }

  private static getBaseTemplate(
    config: EmailTemplateConfig,
    data: EmailTemplateData,
  ): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: ${config.titleColor}; margin-bottom: 20px; text-align: center; border-bottom: 3px solid ${config.borderColor}; padding-bottom: 10px;">
          ${config.title}
        </h2>
        
        <div style="background-color: ${config.highlightBackgroundColor}; padding: 20px; border-radius: 6px; margin-bottom: 25px; text-align: center;">
          <p style="color: ${config.highlightColor}; font-size: 18px; font-weight: bold; margin: 0;">
            ${config.highlightText}
          </p>
        </div>
        
        <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
          ${config.description}
        </p>
        
        <div style="background-color: #ecf0f1; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
          <h3 style="color: #2c3e50; margin-top: 0; margin-bottom: 15px;">${config.detailsTitle}</h3>
          ${config.details}
        </div>
        
        ${
          config.actionTitle
            ? `
        <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; border-radius: 6px; text-align: center; margin-bottom: 25px;">
          <h3 style="margin: 0 0 10px 0; font-size: 18px;">${config.actionTitle}</h3>
          <p style="margin: 0; font-size: 16px;">${config.actionText}</p>
        </div>
        `
            : ''
        }
        
        <p style="color: #7f8c8d; font-size: 14px; text-align: center; margin-top: 25px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
          ${config.footerText} ${config.footerEmoji}
        </p>
      </div>
    </div>
    `
  }

  static generateFinishedTemplate(data: EmailTemplateData): string {
    const config: EmailTemplateConfig = {
      title: `🎉 Ordem de Serviço #${data.workOrderId} - Finalizada!`,
      titleColor: '#27ae60',
      borderColor: '#27ae60',
      highlightColor: '#27ae60',
      highlightBackgroundColor: '#d5f4e6',
      highlightText: '✅ Seu veículo está pronto para retirada!',
      description:
        'A ordem de serviço foi finalizada com sucesso. Seu veículo está pronto e pode ser retirado no local.',
      detailsTitle: '📋 Detalhes da Ordem',
      details: `
        <p style="margin: 10px 0; color: #34495e;"><strong>Número da Ordem:</strong> #${data.workOrderId}</p>
        <p style="margin: 10px 0; color: #34495e;"><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">Finalizada</span></p>
        <p style="margin: 10px 0; color: #34495e;"><strong>Valor Total:</strong> R$ ${data.totalAmount}</p>
      `,
      actionTitle: '🚗 Próximos Passos',
      actionText: 'Dirija-se ao local para retirar seu veículo',
      footerText: 'Obrigado por escolher nossos serviços!',
      footerEmoji: '🚀',
    }

    return this.getBaseTemplate(config, data)
  }

  static generateInProgressCustomerTemplate(data: EmailTemplateData): string {
    const config: EmailTemplateConfig = {
      title: `🔧 Ordem de Serviço #${data.workOrderId} - Em Andamento`,
      titleColor: '#f39c12',
      borderColor: '#f39c12',
      highlightColor: '#f39c12',
      highlightBackgroundColor: '#fef9e7',
      highlightText: '⚡ Trabalho iniciado com sucesso!',
      description:
        'Sua ordem de serviço foi confirmada e está sendo executada. Nossa equipe está trabalhando para entregar o melhor resultado.',
      detailsTitle: '📊 Status Atual',
      details: `
        <p style="margin: 10px 0; color: #34495e;"><strong>Número da Ordem:</strong> #${data.workOrderId}</p>
        <p style="margin: 10px 0; color: #34495e;"><strong>Status:</strong> <span style="color: #f39c12; font-weight: bold;">Em Andamento</span></p>
        <p style="margin: 10px 0; color: #34495e;"><strong>Valor Total:</strong> R$ ${data.totalAmount}</p>
      `,
      actionTitle: '⏰ Acompanhamento',
      actionText:
        'Você será notificado automaticamente quando o serviço for finalizado',
      footerText: 'Estamos trabalhando para você!',
      footerEmoji: '🚗💨',
    }

    return this.getBaseTemplate(config, data)
  }

  static generateInProgressUserTemplate(data: EmailTemplateData): string {
    const config: EmailTemplateConfig = {
      title: `📋 Ordem de Serviço #${data.workOrderId} - Confirmada`,
      titleColor: '#3498db',
      borderColor: '#3498db',
      highlightColor: '#3498db',
      highlightBackgroundColor: '#ebf3fd',
      highlightText: '✅ Ordem aprovada pelo cliente!',
      description:
        'A ordem de serviço foi confirmada pelo cliente e está em andamento. Você pode prosseguir com a execução dos serviços.',
      detailsTitle: '📊 Detalhes da Ordem',
      details: `
        <p style="margin: 10px 0; color: #34495e;"><strong>Número da Ordem:</strong> #${data.workOrderId}</p>
        <p style="margin: 10px 0; color: #34495e;"><strong>Cliente:</strong> ${data.customerName}</p>
        <p style="margin: 10px 0; color: #34495e;"><strong>Veículo:</strong> Placa ${data.vehiclePlate}</p>
        <p style="margin: 10px 0; color: #34495e;"><strong>Status:</strong> <span style="color: #3498db; font-weight: bold;">Em Andamento</span></p>
      `,
      actionTitle: '🚀 Próximos Passos',
      actionText: 'Execute os serviços conforme especificado na ordem',
      footerText: 'Bom trabalho!',
      footerEmoji: '💪🔧',
    }

    return this.getBaseTemplate(config, data)
  }

  static generateAwaitingApprovalTemplate(data: EmailTemplateData): string {
    const servicesHtml =
      data.services
        ?.map(
          (service) => `
        <div style="margin-bottom: 10px; padding: 10px; background-color: #ffffff; border-left: 4px solid #3498db; border-radius: 4px;">
          <strong>${service.serviceName}</strong><br>
          <span style="color: #7f8c8d;">Quantidade: ${service.quantity} | Preço: R$ ${service.totalPrice}</span>
        </div>
      `,
        )
        .join('') || ''

    const partsHtml =
      data.parts
        ?.map(
          (part) => `
        <div style="margin-bottom: 10px; padding: 10px; background-color: #ffffff; border-left: 4px solid #e74c3c; border-radius: 4px;">
          <strong>${part.partName}</strong><br>
          <span style="color: #7f8c8d;">Quantidade: ${part.quantity} | Preço: R$ ${part.totalPrice}</span>
        </div>
      `,
        )
        .join('') || ''

    const config: EmailTemplateConfig = {
      title: `🚗 Ordem de Serviço #${data.workOrderId} - Aguardando Aprovação`,
      titleColor: '#2c3e50',
      borderColor: '#3498db',
      highlightColor: '#2c3e50',
      highlightBackgroundColor: '#ecf0f1',
      highlightText: '📋 Aguardando sua aprovação',
      description:
        'A ordem de serviço foi diagnosticada com sucesso e agora está aguardando sua aprovação para prosseguir com a execução.',
      detailsTitle: '📋 Resumo dos Serviços',
      details: `
        ${servicesHtml}
        ${
          partsHtml
            ? `
        <div style="margin-top: 20px;">
          <h3 style="color: #2c3e50; margin-bottom: 15px;">🔧 Peças Utilizadas</h3>
          ${partsHtml}
        </div>
        `
            : ''
        }
        <div style="background-color: #2c3e50; color: #ffffff; padding: 20px; border-radius: 6px; text-align: center; margin-top: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 20px;">💰 Valor Total</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 0; color: #f39c12;">R$ ${data.totalAmount}</p>
        </div>
      `,
      footerText:
        'Este é um email automático. Em caso de dúvidas, entre em contato conosco.',
      footerEmoji: '',
    }

    return this.getBaseTemplate(config, data)
  }

  static generateDeliveredTemplate(data: EmailTemplateData): string {
    const config: EmailTemplateConfig = {
      title: `🎊 Ordem de Serviço #${data.workOrderId} - Entregue!`,
      titleColor: '#8e44ad',
      borderColor: '#8e44ad',
      highlightColor: '#8e44ad',
      highlightBackgroundColor: '#f4e6f7',
      highlightText: '🚗✨ Seu veículo foi entregue com sucesso!',
      description:
        'É com grande satisfação que informamos que sua ordem de serviço foi concluída e entregue com excelência. Esperamos que você esteja satisfeito com o resultado do nosso trabalho.',
      detailsTitle: '📋 Resumo da Ordem',
      details: `
        <p style="margin: 10px 0; color: #34495e;"><strong>Número da Ordem:</strong> #${data.workOrderId}</p>
        <p style="margin: 10px 0; color: #34495e;"><strong>Status:</strong> <span style="color: #8e44ad; font-weight: bold;">Entregue</span></p>
        <p style="margin: 10px 0; color: #34495e;"><strong>Valor Total:</strong> R$ ${data.totalAmount}</p>
        <p style="margin: 10px 0; color: #34495e;"><strong>Data de Entrega:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
      `,
      actionTitle: '🙏 Obrigado pela Confiança!',
      actionText:
        'Foi um prazer atendê-lo e esperamos vê-lo novamente em breve!',
      footerText: 'Obrigado por escolher nossos serviços!',
      footerEmoji: '🚀💜',
    }

    const baseTemplate = this.getBaseTemplate(config, data)

    // Adicionar seção de avaliação específica para o template de entrega
    const evaluationSection = `
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
    `

    return baseTemplate.replace(
      '<p style="color: #7f8c8d; font-size: 14px; text-align: center; margin-top: 25px; border-top: 1px solid #ecf0f1; padding-top: 20px;">',
      evaluationSection +
        '<p style="color: #7f8c8d; font-size: 14px; text-align: center; margin-top: 25px; border-top: 1px solid #ecf0f1; padding-top: 20px;">',
    )
  }
}
