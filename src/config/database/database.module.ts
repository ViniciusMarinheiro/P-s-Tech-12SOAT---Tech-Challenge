// database.module.ts
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EnvConfigService } from '@/common/service/env/env-config.service'
import { databaseConfig } from './database.config'
import { EnvConfigModule } from '@/common/service/env/env-config.module'

@Module({
  imports: [
    EnvConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvConfigModule],
      useFactory: (envConfigService: EnvConfigService) =>
        databaseConfig(envConfigService),
      inject: [EnvConfigService],
    }),
  ],
})
export class DatabaseModule {}
