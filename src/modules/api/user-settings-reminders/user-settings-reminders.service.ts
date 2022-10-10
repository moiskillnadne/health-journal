import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'

import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { IBaseResponse } from '../../../models/response.models'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'

import { UserSettingsRemindersEntity } from '../../../database/entities/user-settings-reminders.entity'

import { UserSettingsRemindersCrudService } from './user-settings-reminders.crud'

@Injectable()
export class UserSettingsRemindersService {
  constructor(private userSettingsRemindersCrudService: UserSettingsRemindersCrudService) {}

  public async getUserSettingsRemindersByParams(
    userId: string,
    i18n: I18nContext,
  ): Promise<UserSettingsRemindersEntity> {
    const settings = await this.userSettingsRemindersCrudService.getUserSettingsRemindersByParams(userId, {
      select: ['waterInterval', 'waterPeriod', 'waterFrom', 'waterTo'],
    })

    if (!settings) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.SettingsRemindersNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.BAD_REQUEST,
      )
    }

    return settings
  }

  public async saveUserSettingsRemindersByParams(
    userId: string,
    params: Partial<UserSettingsRemindersEntity>,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    await this.userSettingsRemindersCrudService.saveUserSettingsRemindersByParams(userId, params)

    return {
      code: SuccessCodes.UserSettingsUpdated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
    }
  }
}
