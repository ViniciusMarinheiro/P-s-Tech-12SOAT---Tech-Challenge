import { Injectable } from '@nestjs/common'
import { createTransport, Transporter } from 'nodemailer'
import { SendEmailDto } from './dto/send-email.dto'
import { EnvConfigService } from '@/common/service/env/env-config.service'

@Injectable()
export class EmailProvider {
  private transporter: Transporter

  constructor(private readonly envConfigService: EnvConfigService) {
    this.transporter = createTransport({
      host: this.envConfigService.get('SMTP_HOST'),
      port: this.envConfigService.get('PORT_EMAIL'),
      secure: this.envConfigService.get('SECURE_EMAIL'),
      auth: {
        user: this.envConfigService.get('USER_EMAIL'),
        pass: this.envConfigService.get('PASS_EMAIL'),
      },
    })
  }

  async sendEmail(data: SendEmailDto) {
    try {
      const info = await this.transporter.sendMail({
        from: this.envConfigService.get('USER_EMAIL'),
        to: data.recipient,
        subject: data.subject,
        html: data.body,
        attachments: data.attachments,
      })
    } catch (error) {
      console.error('Erro ao enviar o email:', error)
    }
  }
}
