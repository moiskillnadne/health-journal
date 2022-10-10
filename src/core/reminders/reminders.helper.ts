import { addDays, addMonths, addWeeks, addYears } from 'date-fns'

import { ReminderPeriod } from '../../constants/enums/reminders.constants'
import { Procedure } from '../../constants/enums/procedures.constants'

import { UserRemindersEntity } from '../../database/entities/user-reminders.entity'

import { RawPredefinedNotification } from '../notifications/predefined/dto/notifications-predefined.dto'

export const getNextDateByPeriodParams = (datetime: Date, period: ReminderPeriod, interval: number) => {
  switch (period) {
    case ReminderPeriod.Day:
      return addDays(datetime, interval)
    case ReminderPeriod.Week:
      return addWeeks(datetime, interval)
    case ReminderPeriod.Month:
      return addMonths(datetime, interval)
    case ReminderPeriod.Year:
      return addYears(datetime, interval)
    default:
      return addMonths(datetime, interval)
  }
}

export const getNotificationPayloadByReminders = (reminders: UserRemindersEntity[]): RawPredefinedNotification[] => {
  return reminders.map((reminder) => ({
    notification: reminder.notification,
    userId: reminder.userId,
    ...(reminder.procedure?.id ? { userProcedureId: reminder.procedure.id } : {}),
  }))
}

export const hasEmptyUserProceduresHistory = (
  reminder: UserRemindersEntity,
  filtered: UserRemindersEntity[],
  procedures: Procedure[],
  datetime: Date,
) => {
  const regex = reminder.procedure?.name && new RegExp(`^${reminder.procedure.name}$`, 'i')

  return (
    !reminder?.user?.procedures.some((procedure) => {
      if (procedures.includes(procedure.procedure.tag) && procedure.datetime > datetime) {
        if (regex) {
          return regex.test(procedure.name)
        }
        return true
      }
      return false
    }) && !filtered.some((item) => item.userId === reminder.userId)
  )
}
