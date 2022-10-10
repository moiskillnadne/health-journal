import { Measurements } from '../../constants/measurements'

export const isMetricSystem = (system: string) => {
  return system === Measurements.Metric
}
