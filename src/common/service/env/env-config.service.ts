import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

@Injectable()
export class EnvConfigService {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  get<Key extends keyof Env>(key: Key): Env[Key] {
    return this.configService.get(key, { infer: true })
  }
}
