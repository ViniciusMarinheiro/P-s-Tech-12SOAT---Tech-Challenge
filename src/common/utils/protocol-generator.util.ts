export class ProtocolGenerator {
  static generateProtocol(id: number): string {
    const currentYear = new Date().getFullYear()
    const paddedId = id.toString().padStart(5, '0')
    return `OS-${currentYear}-${paddedId}`
  }
}
