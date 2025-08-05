// app.module.ts
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './common/service/env/env'
import { EnvConfigModule } from './common/service/env/env-config.module'
import { DatabaseModule } from './config/database/database.module'
import { CustomersModule } from './modules/customers/customers.module'
import { EnvConfigService } from './common/service/env/env-config.service'
import { GlobalJwtAuthGuard } from './common/guards/global-jwt-auth.guard'

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
    EnvConfigModule,
    DatabaseModule,
    AuthModule,
    CustomersModule,
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
