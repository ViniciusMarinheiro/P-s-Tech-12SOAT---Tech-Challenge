// app.module.ts
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './modules/app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Env, envSchema } from './common/service/env/env'
import { EnvConfigModule } from './common/service/env/env-config.module'
import { DatabaseModule } from './config/database/database.module'
import { CustomersModule } from './modules/customers/customers.module'
import { EnvConfigService } from './common/service/env/env-config.service'
import { GlobalJwtAuthGuard } from './common/guards/global-jwt-auth.guard'
import { VehiclesModule } from './modules/vehicles/vehicles.module'
import { ServicesModule } from './modules/services/services.module'
import { PartsModule } from './modules/parts/parts.module'
import { WorkOrdersModule } from './modules/work-orders/work-orders.module'
import { BullModule } from '@nestjs/bullmq'
import { EmailProviderModule } from './providers/email/email.provider.module'
import { RolesGuard } from './common/guards'
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino'
import * as newrelic from 'newrelic'
import { CustomLogger } from './common/log/custom.logger'

const isTest = process.env.NODE_ENV === 'test'
const isDevelopment = process.env.NODE_ENV !== 'production' && !isTest

// Função para enriquecer logs com metadados do New Relic
const getNewRelicMetadata = () => {
  try {
    return newrelic.getLinkingMetadata()
  } catch (error) {
    return {}
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validate: (env) => {
        return envSchema.parse(env)
      },
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        connection: {
          host: configService.get('REDIS_HOST', { infer: true }),
          port: configService.get('REDIS_PORT', { infer: true }),
          password: configService.get('REDIS_PASSWORD', { infer: true }),
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 1000,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
    }),
    EnvConfigModule,
    DatabaseModule,
    AuthModule,
    CustomersModule,
    VehiclesModule,
    ServicesModule,
    PartsModule,
    WorkOrdersModule,
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: 'trace',
        mixin: () => {
          return getNewRelicMetadata()
        },
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 500) {
            return 'error'
          } else if (res.statusCode >= 400) {
            return 'warn'
          }
          return 'info'
        },
        ...(isDevelopment && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: false,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        }),
      },
    }),
    CustomLogger,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EnvConfigService,
    {
      provide: APP_GUARD,
      useClass: GlobalJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [EnvConfigService, CustomLogger],
})
export class AppModule {}
