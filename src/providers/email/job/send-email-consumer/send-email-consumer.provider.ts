import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { SendEmailDto } from '../../nodemailer/dto/send-email.dto'
import { EmailProvider } from '../../nodemailer/email.provider'

@Processor('SEND_EMAIL_QUEUE')
export class SendEmailConsumerProvider extends WorkerHost {
  constructor(private readonly emailProvider: EmailProvider) {
    super()
  }

  async process(job: Job<SendEmailDto>): Promise<void> {
    await this.emailProvider.sendEmail(job.data)
  }
}
