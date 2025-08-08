import { createHash, randomBytes } from 'crypto'

export function generateUniqueHash(length?: number): string {
  const uniqueValue = `${Date.now()}-${randomBytes(16).toString('hex')}`

  const hash = createHash('sha256').update(uniqueValue).digest('hex')

  if (length) {
    return hash.slice(0, length)
  }

  return hash
}
