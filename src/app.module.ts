// app.module.ts
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
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

const isTest = process.env.NODE_ENV === 'test';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EnvConfigService,
    {
      provide: APP_GUARD,
      useClass: GlobalJwtAuthGuard,
    },
  ],
  exports: [EnvConfigService],
})
export class AppModule {}
