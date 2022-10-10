import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Measurements } from '../../constants/measurements'

export const MeasurementSystemHeader = 'measurement'

export const Measurement = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  return request.headers[MeasurementSystemHeader] as Measurements
})
