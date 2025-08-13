import { EmailProvider } from './email.provider'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { createTransport } from 'nodemailer'
import { SendEmailDto } from './dto/send-email.dto'

// 1. Mockamos a biblioteca 'nodemailer' no topo do arquivo.
//    Isso substitui as funções reais por simulações do Jest.
const mockSendMail = jest.fn()
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: mockSendMail,
  })),
}))

describe('EmailProvider', () => {
  let provider: EmailProvider
  let configService: jest.Mocked<EnvConfigService>

  beforeEach(() => {
    // Limpa os mocks antes de cada teste para garantir isolamento
    jest.clearAllMocks()

    // Cria um mock do serviço de configuração
    configService = {
      get: jest.fn(),
    } as any

    // Fornece valores falsos para as variáveis de ambiente
    configService.get.mockImplementation((key: string) => {
      const configMap = {
        SMTP_HOST: 'smtp.example.com',
        PORT_EMAIL: 587,
        SECURE_EMAIL: false,
        USER_EMAIL: 'from@example.com',
        PASS_EMAIL: 'secretpassword',
      }
      return configMap[key]
    })

    // Instancia o nosso provider. Isso também testa o construtor.
    provider = new EmailProvider(configService)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  it('should create a transporter with correct config on initialization', () => {
    // Verifica se o construtor chamou o createTransport com os dados do mock
    expect(createTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'from@example.com',
        pass: 'secretpassword',
      },
    })
  })

  describe('sendEmail', () => {
    it('should call sendMail with the correct parameters', async () => {
      // Arrange: Preparamos os dados do e-mail
      const emailData: SendEmailDto = {
        recipient: 'to@example.com',
        subject: 'Test Subject',
        body: '<p>Hello World</p>',
      }

      // Act: Chamamos o método
      await provider.sendEmail(emailData)

      // Assert: Verificamos se o sendMail do nodemailer foi chamado corretamente
      expect(mockSendMail).toHaveBeenCalledTimes(1)
      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'from@example.com', // Veio do nosso configService mockado
        to: emailData.recipient,
        subject: emailData.subject,
        html: emailData.body,
        attachments: emailData.attachments,
      })
    })

    it('should log an error if sendMail fails', async () => {
      // Arrange: Configuramos o mock para simular um erro
      const testError = new Error('Failed to send email')
      mockSendMail.mockRejectedValue(testError)

      // Espionamos o console.error para garantir que ele é chamado
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {}) // Impede que o erro seja impresso no console do teste

      const emailData: SendEmailDto = {
        recipient: 'to@example.com',
        subject: 'Test Subject',
        body: '<p>Hello World</p>',
      }

      // Act
      await provider.sendEmail(emailData)

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Erro ao enviar o email:',
        testError,
      )

      // Restaura a função original do console.error
      consoleErrorSpy.mockRestore()
    })
  })
})
