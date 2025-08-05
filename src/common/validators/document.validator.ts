import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import {
  isValidDocument,
  removeDocumentFormatting,
} from '../utils/document.utils'

@ValidatorConstraint({ name: 'DocumentValidator', async: false })
export class DocumentValidator implements ValidatorConstraintInterface {
  validate(document: string): boolean {
    if (!document) return false

    // Remove formatação e valida
    const cleanDocument = removeDocumentFormatting(document)
    return isValidDocument(cleanDocument)
  }

  defaultMessage(): string {
    return 'Documento deve ser um CPF válido (11 dígitos) ou CNPJ válido (14 dígitos)'
  }
}
