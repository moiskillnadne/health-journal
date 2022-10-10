import { I18n, I18nContext } from 'nestjs-i18n'
import { Body, Controller, Get, Post, Req, Delete } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'

import { UserDeviceService } from './user-device.service'

import { PostUserDeviceParamsDto, DeleteUserDeviceParamsDto } from './dtos/user-device.dto'
import { GetUserDevicesParamsDto } from './dtos/user-device-response.dto'

@ApiTags('User Device')
@Controller('user/device')
export class UserDeviceController {
  constructor(private userDeviceService: UserDeviceService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserDevicesParamsDto, isArray: true })
  public findUserDevices(@Req() { user }) {
    return this.userDeviceService.findDevicesByUserId(user.id)
  }

  @Post()
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public registerUserDevice(@Req() { user }, @Body() body: PostUserDeviceParamsDto, @I18n() i18n: I18nContext) {
    return this.userDeviceService.saveDeviceByUserId(user.id, body, i18n)
  }

  @Delete()
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public removeUserDevices(@Req() { user }, @Body() body: DeleteUserDeviceParamsDto) {
    return this.userDeviceService.removeUserDevicesByParams(user.id, body)
  }
}
