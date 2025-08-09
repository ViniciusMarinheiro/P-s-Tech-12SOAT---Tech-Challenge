import { Test, TestingModule } from '@nestjs/testing'
import { SendEmailConsumerProvider } from './send-email-consumer.provider'
import { EmailProvider } from '../../nodemailer/email.provider'
import { Job } from 'bullmq'
import { SendEmailDto } from '../../nodemailer/dto/send-email.dto'

// Mockamos o EmailProvider, já que ele foi testado separadamente
const mockEmailProvider = {
  sendEmail: jest.fn(),
}

describe('SendEmailConsumerProvider', () => {
  let consumer: SendEmailConsumerProvider
  let emailProvider: jest.Mocked<EmailProvider>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailConsumerProvider,
        {
          provide: EmailProvider,
          useValue: mockEmailProvider,
        },
      ],
    }).compile()

    consumer = module.get<SendEmailConsumerProvider>(SendEmailConsumerProvider)
    emailProvider = module.get(EmailProvider)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(consumer).toBeDefined()
  })

  describe('process', () => {
    it('should call emailProvider.sendEmail with the data from the job', async () => {
      // --- Arrange: Preparamos o cenário ---
      // 1. Criamos os dados que estariam dentro do job
      const jobData: SendEmailDto = {
        recipient: 'test@example.com',
        subject: 'Job Test',
        body: '<h1>Testing Queue</h1>',
      }
      // 2. Criamos um objeto de job falso que se parece com o original do BullMQ
      const mockJob = { data: jobData } as Job<SendEmailDto>

      // --- Act: Executamos o método a ser testado ---
      await consumer.process(mockJob)

      // --- Assert: Verificamos se o mock foi chamado corretamente ---
      expect(emailProvider.sendEmail).toHaveBeenCalledTimes(1)
      expect(emailProvider.sendEmail).toHaveBeenCalledWith(jobData)
    })

    it('should allow errors to propagate if emailProvider.sendEmail fails', async () => {
      // Arrange: Configuramos o mock para simular um erro
      const jobData: SendEmailDto = {
        recipient: 'fail@example.com',
        subject: 'Fail Test',
        body: '',
      }
      const mockJob = { data: jobData } as Job<SendEmailDto>
      const testError = new Error('SMTP Connection Failed')
      emailProvider.sendEmail.mockRejectedValue(testError)

      // Act & Assert: Verificamos se o erro é propagado
      // (Isso é importante para que o BullMQ possa tentar reprocessar o job)
      await expect(consumer.process(mockJob)).rejects.toThrow(testError)
    })
  })
})
