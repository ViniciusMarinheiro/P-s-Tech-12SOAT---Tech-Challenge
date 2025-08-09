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

  // mapeia o alias "@/..." -> "src/..."
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
