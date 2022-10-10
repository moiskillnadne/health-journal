import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function ValidateSequenceNestedProperty(nestedProperty: string, validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [{ nestedProperty }],
      validator: {
        validate: (value, args): boolean => {
          const { nestedProperty } = args.constraints[0]

          const sequence = value.map((item) => item[nestedProperty]).sort((a, b) => a - b)
          for (let i = 0; i < sequence.length; i++) {
            // The order is not start from 1
            if (i == 0 && sequence[i] !== 1) {
              return false
            }
            // The number is out of order
            if (i !== 0 && sequence[i] !== sequence[i - 1] + 1) {
              return false
            }
          }
          return true
        },
        defaultMessage: (args: ValidationArguments): string => {
          return `Some items of '${args.property}' has invalid order sequence of nested property '${args.constraints[0].nestedProperty}' of nested object`
        },
      },
    })
  }
}
