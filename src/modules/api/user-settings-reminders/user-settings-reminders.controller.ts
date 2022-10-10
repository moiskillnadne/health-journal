import { I18n, I18nContext } from 'nestjs-i18n'
import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'

import { UserSettingsRemindersService } from './user-settings-reminders.service'

import { UserSettingsRemindersBodyParamsDto } from './dto/user-settings-reminders.dto'
import { GetUserSettingsRemindersResponseDto } from './dto/user-settings-reminders.response.dto'

@ApiTags('User Settings Reminders')
@Controller('user/settings/reminders')
export class UserSettingsRemindersController {
  constructor(private userSettingsRemindersService: UserSettingsRemindersService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserSettingsRemindersResponseDto })
  public getUserSettingsReminders(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userSettingsRemindersService.getUserSettingsRemindersByParams(user.id, i18n)
  }

  @Post()
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public addUserSteps(@Req() { user }, @Body() body: UserSettingsRemindersBodyParamsDto, @I18n() i18n: I18nContext) {
    return this.userSettingsRemindersService.saveUserSettingsRemindersByParams(user.id, body, i18n)
  }
}
