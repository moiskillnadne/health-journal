import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { Public } from '../../../core/decorators/public-route.decorator'
import { BadRequestError } from '../../../core/errors/bad-request.error'
import { convertMLtoFLOZ } from '../../../core/measurements/water.converter'
import { I18n, I18nContext } from 'nestjs-i18n'

@Controller('test-api')
@Public()
export class TestController {
  @Post('/test')
  public testGuardPost(@Body() body): any {
    if (body.error) {
      throw new BadRequestError('Test bad request exception', ErrorCodes.UserAlreadyExist, HttpStatus.BAD_REQUEST, {
        username: 'vitya already exist',
      })
    }

    return 'Success /test :POST'
  }

  @Get('/test')
  public testGuardGet(@I18n() i18n: I18nContext): any {
    return `Success /test :GET Locale: ${i18n.lang} - ${i18n.t('test.hello')}`
  }

  @Post('/convert')
  public convert(@Body() body) {
    const { count } = body

    return convertMLtoFLOZ(Number(count))
  }
}
