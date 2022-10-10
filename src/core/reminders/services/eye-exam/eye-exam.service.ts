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
export class EyeExamReminderService {
  constructor(private userRemindersService: UserRemindersService, private notificationService: NotificationService) {}

  async sendEyeExamToScheduleReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.DiabeticEyeExamToSchedule],
      {
        relations: { user: { procedures: { procedure: true } } },
        where: { user: { settingNotifications: { eyeExamEnable: true } } },
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
          hasEmptyUserProceduresHistory(reminder, list, [Procedure.DiabeticEyeExam], datetime)
        ) {
          list.push(reminder)
        }
      }

      return list
    }, [])

    if (!filtered.length) {
      return logger.log('sendEyeExamToScheduleReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendEyeExamToScheduleReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }

  async sendEyeExamToExpireReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.DiabeticEyeExamToExpire],
      {
        relations: { procedure: true, user: { procedures: { procedure: true } } },
        where: { user: { settingNotifications: { eyeExamEnable: true } } },
      },
    )

    const filtered = reminders.reduce((list: UserRemindersEntity[], reminder) => {
      const datetime = reminder.lastExecuteAt || reminder.procedure?.datetime
      const next = getNextDateByPeriodParams(
        datetime,
        reminder.period || reminder.notification.remindPeriod,
        reminder.interval || reminder.notification.remindInterval,
      )

      if (isToday(next) && hasEmptyUserProceduresHistory(reminder, list, [Procedure.DiabeticEyeExam], datetime)) {
        list.push(reminder)
      }

      return list
    }, [])

    if (!filtered.length) {
      return logger.log('sendEyeExamToExpireReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.userRemindersService.upsertUserRemindersByType(
      filtered.map((reminder) => reminder.userId),
      NotificationType.DiabeticEyeExamToSchedule,
    )

    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendEyeExamToExpireReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }
}
