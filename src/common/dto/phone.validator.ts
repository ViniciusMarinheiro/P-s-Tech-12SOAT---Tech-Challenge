import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator'
import { ErrorMessages } from '../constants/errorMessages'

@ValidatorConstraint({ name: 'PhoneValidator', async: false })
export class PhoneValidator implements ValidatorConstraintInterface {
  validate(phone: string): boolean {
    if (!phone) return false

    const cleanPhone = phone.replace(/\D/g, '')

    if (cleanPhone.length < 10 || cleanPhone.length > 11) return false

    const firstDigit = parseInt(cleanPhone.charAt(2))
    if (cleanPhone.length === 11 && firstDigit !== 9) return false

    const ddd = parseInt(cleanPhone.substring(0, 2))
    if (ddd < 11 || ddd > 99) return false

    return true
  }

  defaultMessage(): string {
    return 'Telefone ($value) deve ser um número válido brasileiro (DDD + número)'
  }
}

export function IsPhone(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: PhoneValidator,
    })
  }
}
