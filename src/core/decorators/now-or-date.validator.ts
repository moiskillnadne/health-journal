import { registerDecorator, ValidationOptions, ValidationArguments, isDateString } from 'class-validator'

export function ValidateNowOrDate(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate: (value, args): boolean => {
          return value === 'now' || isDateString(value)
        },
        defaultMessage: (args: ValidationArguments): string => {
          return `Value should be valid date or 'now'`
        },
      },
    })
  }
}
