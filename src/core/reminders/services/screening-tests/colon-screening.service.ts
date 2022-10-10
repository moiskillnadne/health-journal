import { isToday } from 'date-fns'
import { Injectable } from '@nestjs/common'

import { NotificationType } from '../../../../constants/enums/notifications.constants'
import { Procedure } from '../../../../constants/enums/procedures.constants'

import { UserRemindersEntity } from '../../../../database/entities/user-reminders.entity'

import { logger } from '../../reminders.logger'
import {
  getNextDateByPeriodParams,
  getNotificationPayloadByReminders,
  hasEmptyUserProceduresHistory,
} from '../../reminders.helper'

import { NotificationService } from '../../../notifications/predefined/notification.service'
import { UserRemindersService } from '../../../../modules/api/user-reminders/user-reminders.service'

@Injectable()
export class ColonScreeningReminderService {
  constructor(private userRemindersService: UserRemindersService, private notificationService: NotificationService) {}

  async sendColonScreeningToScheduleReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.ColonScreeningToSchedule],
      {
        relations: { user: { procedures: { procedure: true } } },
        where: { user: { settingNotifications: { screeningTestsEnable: true, colonScreeningEnable: true } } },
      },
    )

    const filtered = reminders.reduce((list: UserRemindersEntity[], reminder) => {
      const datetime = reminder.lastExecuteAt || reminder.createAt
      const next = getNextDateByPeriodParams(
        datetime,
        reminder.period || reminder.notification.remindPeriod,
        reminder.interval || reminder.notification.remindInterval,
      )

      if (isToday(next)) {
        if (
          !reminder.user.procedures.length ||
          hasEmptyUserProceduresHistory(
            reminder,
            list,
            [Procedure.BloodStoolTesting, Procedure.Cologuard, Procedure.Colonoscopy, Procedure.Colonography],
            datetime,
          )
        ) {
          list.push(reminder)
        }
      }

      return list
    }, [])

    if (!filtered.length) {
      return logger.log('sendColonScreeningToScheduleReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendColonScreeningToScheduleReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }

  async sendColonScreeningToExpireReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.ColonScreeningToExpire],
      {
        relations: { procedure: true, user: { procedures: { procedure: true } } },
        where: { user: { settingNotifications: { screeningTestsEnable: true, colonScreeningEnable: true } } },
      },
    )

    logger.log(`User reminders found by type (${NotificationType.ColonScreeningToExpire}) - ${reminders.length}`)

    const filtered = reminders.reduce((list: UserRemindersEntity[], reminder) => {
      const datetime = reminder.lastExecuteAt || new Date(reminder.procedure?.datetime)
      const next = getNextDateByPeriodParams(
        datetime,
        reminder.period || reminder.notification.remindPeriod,
        reminder.interval || reminder.notification.remindInterval,
      )

      logger.log(`${reminder?.notification?.procedure?.name} - ${next}- isToday - ${isToday(next)} {{${reminder.id}}}`)

      if (isToday(next)) {
        logger.log(`PUSHED - ${reminder?.notification?.procedure?.name} - ${reminder.id}`)
        list.push(reminder)
      }

      return list
    }, [])

    if (!filtered.length) {
      return logger.log('sendColonScreeningToExpireReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.userRemindersService.upsertUserRemindersByType(
      filtered.map((reminder) => reminder.userId),
      NotificationType.ColonScreeningToSchedule,
    )

    logger.log(`Filtered reminders - ${filtered.length}`)
    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendColonScreeningToExpireReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }
}
