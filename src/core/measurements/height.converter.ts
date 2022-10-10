import configMeasurements, { length } from 'convert-units'

const convert = configMeasurements({
  length,
})

export const convertCmToFt = (count: number): number => {
  return convert(count).from('cm').to('ft')
}

export const convertCmToIn = (count: number): number => {
  return convert(count).from('cm').to('in')
}

export const convertFtToCm = (count: number): number => {
  return convert(count).from('ft').to('cm')
}

export const convertInToCm = (count: number): number => {
  return convert(count).from('in').to('cm')
}
