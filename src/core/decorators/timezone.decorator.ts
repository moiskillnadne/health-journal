import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const TimezoneHeader = 'accept-timezone'

export const Timezone = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  return request.headers[TimezoneHeader] as string
})
