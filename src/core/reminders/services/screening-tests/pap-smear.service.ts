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
export class PapSmearReminderService {
  constructor(private userRemindersService: UserRemindersService, private notificationService: NotificationService) {}

  async sendPapSmearToScheduleReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.PapSmearToSchedule],
      {
        relations: { user: { procedures: { procedure: true } } },
        where: { user: { settingNotifications: { screeningTestsEnable: true, papSmearEnable: true } } },
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
          hasEmptyUserProceduresHistory(reminder, list, [Procedure.PapSmear], datetime)
        ) {
          list.push(reminder)
        }
      }

      return list
    }, [])

    if (!filtered.length) {
      return logger.log('sendPapSmearToScheduleReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendPapSmearToScheduleReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }

  async sendPapSmearToExpireReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.PapSmearToExpire],
      {
        relations: { procedure: true, user: { procedures: { procedure: true } } },
        where: { user: { settingNotifications: { screeningTestsEnable: true, papSmearEnable: true } } },
      },
    )

    logger.log(`papsmear reminders: ${reminders.length}`)

    const filtered = reminders.reduce((list: UserRemindersEntity[], reminder) => {
      const datetime = reminder.lastExecuteAt || new Date(reminder.procedure?.date)
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
      return logger.log('sendPapSmearToExpireReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.userRemindersService.upsertUserRemindersByType(
      filtered.map((reminder) => reminder.userId),
      NotificationType.PapSmearToSchedule,
    )

    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendPapSmearToExpireReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }
}
