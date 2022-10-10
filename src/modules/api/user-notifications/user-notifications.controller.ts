import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Req, Delete, Param, Body, Post } from '@nestjs/common'
import { I18n, I18nContext } from 'nestjs-i18n'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'

import { UserNotificationsService } from './user-notifications.service'

import { GetUserNotificationsResponseDto } from './dto/user-notifications.response.dto'

@ApiTags('User Notifications')
@Controller('user/notifications')
export class UserNotificationsController {
  constructor(private userNotificationsService: UserNotificationsService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserNotificationsResponseDto, isArray: true })
  public getUserNotifications(@Req() { user }) {
    return this.userNotificationsService.getUserNotificationsByUserId(user.id)
  }

  @Get('count')
  @ApiResponse({ status: 200, type: Number })
  public getUserNotificationsCount(@Req() { user }) {
    return this.userNotificationsService.getUserNotificationsCountByUserId(user.id)
  }

  @Post('viewed')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public updateUserNotificationsStatus(@Body() ids: string[], @I18n() i18n: I18nContext) {
    return this.userNotificationsService.updateUserNotificationsStatusByIds(ids, i18n)
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public deleteUserNotification(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.userNotificationsService.deleteUserNotificationById(id, i18n)
  }
}
