import { evaluate } from 'mathjs'
import { Measurements } from '../../constants/measurements'
import { UserCardHeightOptionalParamsDto } from '../../modules/api/user-card/dto/user-card-height.dto'
import { UserCardWeightOptionalParamsDto } from '../../modules/api/user-card/dto/user-card-weight.dto'

const INCHES_CONVERSION_FACTOR = 703

function cmToMeter(cm: string | number) {
  return Number(cm) / 100
}

function ftToInch(fit: string | number) {
  return Number(fit) * 12
}

export function getBMI(
  weight: UserCardWeightOptionalParamsDto,
  height: UserCardHeightOptionalParamsDto,
  unit: Measurements,
) {
  if (!weight || !height) {
    return undefined
  }

  const factor = unit === Measurements.USA ? INCHES_CONVERSION_FACTOR : 1

  const measurementValues = {
    weight: unit === Measurements.USA ? Number(weight.lb) : Number(weight.kg),
    height: unit === Measurements.USA ? ftToInch(height.ft || '0') + Number(height.in) : cmToMeter(height.cm || '0'),
  }
  const result: number = evaluate(`${factor} * weight / height ^ 2`, measurementValues)

  return !!result && result !== Infinity && typeof result === 'number' ? String(result.toFixed(1)) : undefined
}
