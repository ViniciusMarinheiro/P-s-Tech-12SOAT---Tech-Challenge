import { ColumnOptions } from 'typeorm'

const isTest = process.env.NODE_ENV === 'test'

export const columnDate = (opts: ColumnOptions = {}): ColumnOptions => ({
  type: isTest ? 'datetime' : 'timestamp',
  ...opts,
})
