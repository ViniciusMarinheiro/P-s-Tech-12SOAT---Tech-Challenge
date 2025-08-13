import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { SendEmailDto } from '../../nodemailer/dto/send-email.dto'

@Injectable()
export class SendEmailQueueProvider {
  constructor(@InjectQueue('SEND_EMAIL_QUEUE') private sendEmailQueue: Queue) {}

  async execute(data: SendEmailDto) {
    await this.sendEmailQueue.add('SEND_EMAIL_QUEUE', data)
  }
}
