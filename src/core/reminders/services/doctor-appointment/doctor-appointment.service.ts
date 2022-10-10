import { isToday } from 'date-fns'
import { Injectable } from '@nestjs/common'

import { NotificationType } from '../../../../constants/enums/notifications.constants'

import { UserRemindersEntity } from '../../../../database/entities/user-reminders.entity'

import { logger } from '../../reminders.logger'
import { getNextDateByPeriodParams, getNotificationPayloadByReminders } from '../../reminders.helper'

import { NotificationService } from '../../../notifications/predefined/notification.service'
import { UserRemindersService } from '../../../../modules/api/user-reminders/user-reminders.service'

@Injectable()
export class DoctorAppointmentReminderService {
  constructor(private userRemindersService: UserRemindersService, private notificationService: NotificationService) {}

  async sendDoctorAppointmentToScheduleReminder() {
    const reminders = await this.userRemindersService.getUserRemindersByNotificationTypes(
      [NotificationType.DoctorAppointmentToSchedule],
      {
        relations: { user: { appointments: true } },
        where: { user: { settingNotifications: { scheduleAnAppointmentEnable: true } } },
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
          !reminder.user.appointments.length ||
          !reminder.user.appointments.some((appointment) => appointment.datetime > datetime)
        ) {
          list.push(reminder)
        }
      }

      return list
    }, [])

    if (!filtered.length) {
      return logger.log('sendDoctorAppointmentToScheduleReminder has nothing to execute')
    }

    await this.userRemindersService.updateUserReminderById(
      filtered.map((reminder) => reminder.id),
      { lastExecuteAt: new Date() },
    )

    await this.notificationService.send(getNotificationPayloadByReminders(filtered))

    return logger.log(`sendDoctorAppointmentToScheduleReminder executed: ${filtered.map((reminder) => reminder.id)}`)
  }
}
