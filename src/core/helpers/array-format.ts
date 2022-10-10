import { OptionsDto } from '../dtos/shared/options.dto'

export const toValueLabelFormat = (array: string[] | number[]): OptionsDto[] => {
  return array.map((item) => ({
    value: item,
    label: item,
  }))
}
