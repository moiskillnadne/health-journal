import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from './core/decorators/public-route.decorator'

@ApiTags('root')
@Public()
@Controller()
export class AppController {
  @Get('healthcheck')
  getStatusOk(): string {
    return 'OK'
  }
}
