import { I18nValidationError } from 'nestjs-i18n'

export interface IErrorOutput {
  property: string
  paths: Array<string>
}

export const errorFormat = (errors: Array<I18nValidationError>): Array<IErrorOutput> => {
  const nestedErrorsToList = (errors, parentPropertyPath = '') => {
    let result = []
    for (const error of errors) {
      const { property, children, constraints } = error
      const currentPropertyPath = parentPropertyPath ? `${parentPropertyPath}.${property}` : property
      const preparedError = { property: currentPropertyPath, paths: [] }
      for (const key in constraints) {
        const value = constraints[key]
        preparedError.paths.push(value)
      }
      result = preparedError.paths.length
        ? [...result, ...[preparedError], ...nestedErrorsToList(children, currentPropertyPath)]
        : [...result, ...nestedErrorsToList(children, currentPropertyPath)]
    }

    return result
  }

  return nestedErrorsToList(errors)
}
