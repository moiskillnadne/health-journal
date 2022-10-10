import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'
import { NotificationsDTO } from './user-settings-notifications.dto'
import { UserSettingsNotificationsService } from './user-settings-notifications.service'

@ApiTags('User Settings Notifications')
@Controller('user/settings/notifications')
export class UserSettingsNotificationsController {
  constructor(private userSettingsNotificationsService: UserSettingsNotificationsService) {}

  @Get()
  public getUserNotificationByUserId(@Req() req, @I18n() i18n: I18nContext): Promise<NotificationsDTO> {
    return this.userSettingsNotificationsService.getNotificationsByUserId(req.user.id, i18n)
  }

  @Post('save')
  public updateNotificationByUserId(
    @Req() req,
    @Body() body: NotificationsDTO,
    @I18n() i18n: I18nContext,
  ): Promise<NotificationsDTO> {
    return this.userSettingsNotificationsService.saveUserNotificationsByUserId(req.user.id, body, i18n)
  }
}
