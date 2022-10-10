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
export class MammogramReminderService {
  constructor(private userRemindersService: UserRemindersService, private notificationService: NotificationService) {}

  async sendMammogramToScheduleReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.MammogramToSchedule],
      {
        relations: { user: { procedures: { procedure: true } } },
        where: { user: { settingNotifications: { screeningTestsEnable: true, mammogramEnable: true } } },
      },
    )

    const filtered = reminders.reduce((list: UserRemindersEntity[], reminder) => {
      const datetime = reminder.lastExecuteAt || reminder.createAt
      const next = getNextDateByPeriodParams(
        datetime,
        reminder.period || reminder.notification.remindPeriod,
        reminder.interval || reminder.notification.remindInterval,
      )

      logger.log(`${reminder?.procedure?.name || reminder?.notification?.procedure?.name} - ${datetime}`)
      logger.log(`${reminder?.procedure?.name || reminder?.notification?.procedure?.name} - ${next}`)

      if (isToday(next)) {
        if (
          !reminder.user.procedures.length ||
          hasEmptyUserProceduresHistory(reminder, list, [Procedure.Mammogram], datetime)
        ) {
          list.push(reminder)
        }
      }

      return list
    }, [])

    if (!filtered.length) {
      return logger.log('sendMammogramToScheduleReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendMammogramToScheduleReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }

  async sendMammogramToExpireReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.MammogramToExpire],
      {
        relations: { procedure: true, user: { procedures: { procedure: true } } },
        where: { user: { settingNotifications: { screeningTestsEnable: true, mammogramEnable: true } } },
      },
    )

    logger.log(`mammogram reminders: ${reminders.length}`)

    const filtered = reminders.reduce((list: UserRemindersEntity[], reminder) => {
      const datetime = reminder.lastExecuteAt || new Date(reminder.procedure?.datetime)

      const next = getNextDateByPeriodParams(
        datetime,
        reminder.period || reminder.notification.remindPeriod,
        reminder.interval || reminder.notification.remindInterval,
      )

      if (isToday(next)) {
        list.push(reminder)
      }

      return list
    }, [])

    if (!filtered.length) {
      return logger.log('sendMammogramToExpireReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.userRemindersService.upsertUserRemindersByType(
      filtered.map((reminder) => reminder.userId),
      NotificationType.MammogramToSchedule,
    )

    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendMammogramToExpireReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }
}
