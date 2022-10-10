import configMeasurements, { volume } from 'convert-units'

const convert = configMeasurements({
  volume,
})

export const convertFLOZtoML = (count: number): number => {
  return convert(count).from('fl-oz').to('ml')
}

export const convertMLtoFLOZ = (count: number): number => {
  return convert(count).from('ml').to('fl-oz')
}
