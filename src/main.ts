require('newrelic')
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { CustomLogger } from './common/log/custom.logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  })

  app.useLogger(app.get(CustomLogger))

  const logger = new Logger('MAIN')

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-time-zone',
    credentials: false,
  })

  const envConfigService = app.get(EnvConfigService)
  const port = envConfigService.get('PORT')

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  app.setGlobalPrefix(envConfigService.get('DOCUMENTATION_PREFIX'))

  app.use(helmet())

  const config = new DocumentBuilder()
    .setTitle('P&S Tech - 12SOAT API')
    .setDescription('API para gerenciamento de oficina mecânica')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
      },
      'Bearer',
    )
    .build()

  const documentationPrefix = envConfigService.get('DOCUMENTATION_PREFIX')

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(documentationPrefix + '/documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  app
    .getHttpAdapter()
    .get(`/${documentationPrefix}/documentation/json`, (req, res) => {
      res.send(document)
    })

  await app.listen(port)

  logger.log(`HTTP server started on port ${port}`)
}
bootstrap()
