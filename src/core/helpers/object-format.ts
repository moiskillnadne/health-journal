import { OptionsDto } from '../dtos/shared/options.dto'

export const toValueLabelFormat = (object: Record<string, string | number>): OptionsDto[] => {
  return Object.keys(object).map((key) => ({
    value: object[key],
    label: key,
  }))
}

export const removeNullableProperties = (object: Record<string, any>): Record<string, any> => {
  return Object.entries(object)
    .filter(([key, value]) => !!value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
}

export const mapBy = <T>(list: Array<T>, keyField: keyof T): { [key: string]: T } => {
  return Object.fromEntries(list.map((item) => [item[keyField.toString()], item]))
}
