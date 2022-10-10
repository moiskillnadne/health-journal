import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'

@Controller('/admin/test-api')
export class AdminTestController {
  @Post('/test')
  public testGuardPost(@Body() body): any {
    if (body.error) {
      throw new BadRequestError('Test bad request exception', ErrorCodes.UserAlreadyExist, HttpStatus.BAD_REQUEST, {
        username: 'vitya already exist',
      })
    }

    return 'Success /admin/test :POST'
  }

  @Get('/test')
  public testGuardGet(): any {
    return 'Success /admin/test :GET'
  }
}
