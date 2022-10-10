import { HttpStatus, Injectable } from '@nestjs/common'

import {
  NotificationToExpireTypes,
  NotificationTypeToSettingsColumn,
  NotificationTypeToRemindType,
} from '../../constants/enums/notifications.constants'

import { SuccessCodes } from '../../constants/responses/codes.success.constants'

import { UserRemindersService } from '../../modules/api/user-reminders/user-reminders.service'
import { UserProceduresCrudService } from '../../modules/api/user-procedures/user-procedures.crud'
import { UserSettingsNotificationsCrudService } from '../../modules/api/user-settings-notifications/user-settings-notifications.crud'

import { NotificationsRemindBodyParamsDto, NotificationsStopBodyParamsDto } from './dto/notifications.dto'

@Injectable()
export class NotificationsService {
  constructor(
    private userRemindersService: UserRemindersService,
    private userProceduresCrudService: UserProceduresCrudService,
    private userSettingsNotificationsCrudService: UserSettingsNotificationsCrudService,
  ) {}

  async upsertUserProcedureRemindersByParams(params: NotificationsRemindBodyParamsDto) {
    const type = NotificationTypeToRemindType[params.type]

    if (type) {
      await this.userRemindersService.upsertUserRemindersByType([params.userId], type)
    }

    return {
      code: SuccessCodes.UserReminderUpdated,
      httpCode: HttpStatus.OK,
    }
  }

  async removeUserProcedureRemindersByParams(params: NotificationsStopBodyParamsDto) {
    let procedure

    if (NotificationToExpireTypes.includes(params.type) && params.procedureId) {
      procedure = await this.userProceduresCrudService.getUserProcedureById(params.procedureId)

      if (procedure?.reminder?.id) {
        await this.userRemindersService.deleteUserReminderByNotificationType(params.type, {
          userId: params.userId,
          ...(procedure?.reminder?.id ? { id: procedure.reminder.id } : {}),
        })
      }
    }

    if (Object.keys(NotificationTypeToSettingsColumn).includes(params.type)) {
      await this.userSettingsNotificationsCrudService.updateNotificationByUserId(params.userId, {
        [NotificationTypeToSettingsColumn[params.type]]: false,
      })
    }

    return {
      code: SuccessCodes.UserReminderDeleted,
      httpCode: HttpStatus.OK,
    }
  }
}
