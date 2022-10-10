import { registerDecorator, ValidationOptions, ValidationArguments, isDateString } from 'class-validator'

export function ValidateDatePeriod(fromFieldName: string, toFieldName: string, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidateDatePeriod',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [fromFieldName, toFieldName],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [fromFieldName, toFieldName] = args.constraints
          let from = args.object[fromFieldName] ?? null
          from = isDateString(from) ? new Date(from) : from
          let to = args.object[toFieldName]
          to = isDateString(to) ? new Date(to) : to
          return from && to ? from.getTime() <= to.getTime() : true
        },
        defaultMessage(args?: ValidationArguments) {
          const [fromFieldName, toFieldName] = args.constraints
          return `The date of '${fromFieldName}' should be earlier than the field '${toFieldName}'`
        },
      },
    })
  }
}
