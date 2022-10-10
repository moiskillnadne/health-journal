import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export function MaxLengthHtml(max: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'MaxLengthHtml',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [max],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [max] = args.constraints
          const preparedValue = value.replace(new RegExp(/(<([^>]+)>)/gi), '')
          return preparedValue.length <= max
        },
        defaultMessage(args?: ValidationArguments) {
          const [max] = args.constraints
          return `The content without HTML tags of field ${args.property} must be shorter than or equal to ${max} characters`
        },
      },
    })
  }
}
