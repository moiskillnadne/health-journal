import configMeasurements, { mass } from 'convert-units'

const convert = configMeasurements({
  mass,
})

export const convertKgToLb = (count: number): number => {
  return convert(count).from('kg').to('lb')
}

export const convertLbToKg = (count: number): number => {
  return Math.round(convert(count).from('lb').to('kg'))
}
