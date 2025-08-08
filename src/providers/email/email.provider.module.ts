import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvConfigModule } from '@/common/service/env/env-config.module'
import { SendEmailConsumerProvider } from './job/send-email-consumer/send-email-consumer.provider'
import { SendEmailQueueProvider } from './job/send-email-queue/send-email-queue.provider'
import { EmailProvider } from './nodemailer/email.provider'

@Module({
  imports: [
    ConfigModule,
    EnvConfigModule,
    BullModule.registerQueue({ name: 'SEND_EMAIL_QUEUE' }),
  ],
  providers: [EmailProvider, SendEmailQueueProvider, SendEmailConsumerProvider],
  exports: [SendEmailQueueProvider],
})
export class EmailProviderModule {}
