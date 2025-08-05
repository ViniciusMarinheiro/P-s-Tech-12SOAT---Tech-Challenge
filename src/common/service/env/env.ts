import { z } from 'zod'

export const envSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  DB_SCHEMA: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  PORT: z.string().default('3333'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DOCUMENTATION_PREFIX: z.string(),
})

export type Env = z.infer<typeof envSchema>
