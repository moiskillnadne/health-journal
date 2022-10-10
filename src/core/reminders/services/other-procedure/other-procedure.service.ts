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
export class OtherProcedureReminderService {
  constructor(private userRemindersService: UserRemindersService, private notificationService: NotificationService) {}

  async sendOtherProcedureToScheduleReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.OtherProcedureToSchedule],
      {
        relations: { user: { procedures: { procedure: true } } },
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
          hasEmptyUserProceduresHistory(reminder, list, [Procedure.Other], datetime)
        ) {
          list.push(reminder)
        }
      }

      return list
    }, [])

    if (!filtered.length) {
      return logger.log('sendOtherProcedureToScheduleReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendOtherProcedureToScheduleReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }

  async sendOtherProcedureToExpireReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.OtherProcedureToExpire],
      {
        relations: { procedure: true, user: { procedures: { procedure: true } } },
      },
    )

    logger.log(`other reminders: ${reminders.length}`)

    const filtered = reminders.reduce((list: UserRemindersEntity[], reminder) => {
      const datetime = reminder.lastExecuteAt || reminder.procedure?.datetime
      const next = getNextDateByPeriodParams(
        datetime,
        reminder.period || reminder.notification.remindPeriod,
        reminder.interval || reminder.notification.remindInterval,
      )

      if (isToday(next) && hasEmptyUserProceduresHistory(reminder, list, [Procedure.Other], datetime)) {
        list.push(reminder)
      }

      return list
    }, [])

    if (!filtered.length) {
      return logger.log('sendOtherProcedureToExpireReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.userRemindersService.upsertUserRemindersByType(
      filtered.map((reminder) => reminder.userId),
      NotificationType.OtherProcedureToSchedule,
    )

    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendOtherProcedureToExpireReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }
}
