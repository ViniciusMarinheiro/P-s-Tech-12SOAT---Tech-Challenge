// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.', // raiz do projeto (equivalente ao anterior + mais claro)

  moduleFileExtensions: ['ts', 'js', 'json'],

  // segue o padrão que você usava
  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // cobre só arquivos de src/ como antes (ajuste se quiser)
  collectCoverageFrom: ['src/**/*.(t|j)s'],

  // põe em coverage/ na raiz (equivalente ao "../coverage" quando rootDir era "src")
  coverageDirectory: '<rootDir>/coverage',

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '.module.ts$',       // Ignora arquivos de módulo (ex: app.module.ts)
    '.dto.ts$',          // Ignora arquivos de DTO
    '.entity.ts$',       // Ignora arquivos de entidade
    'main.ts$',          // Ignora o arquivo principal de bootstrap
    '.interface.ts$',    // Ignora arquivos de interface
    '.enum.ts$',         // Ignora arquivos de enum
    'index.ts$',         // Ignora arquivos de index'
    'repository.ts$',    // Ignora arquivos de repositório
    'src/config/', // Ignora arquivos de configuração
    'src/migrations/', // Ignora migrações do TypeORM
    'src/seeds/', // Ignora seeds do TypeORM
    'src/common/constants',     // Ignora arquivos de constantes
    'src/common/decorators', // Ignora decorators
    'src/common/exceptions', // Ignora exceptions
    'src/common/service', // Ignora serviços comuns
    'src/common/guards/jwt-auth.guard.ts', // Ignora o guard de autenticação JWT
  ],

  // mapeia o alias "@/..." -> "src/..."
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
