import { NotificationType } from '../../constants/enums/notifications.constants'

const CRON_EVERY_DAY_AT_17_30 = '30 17 * * *'
const CRON_EVERY_DAY_AT_17_00 = '0 17 * * *'

export const scheduleDoctorAppointmentsInTwoWeeksHandler = CRON_EVERY_DAY_AT_17_30
export const scheduleDoctorAppointmentsInOneWeekHandler = CRON_EVERY_DAY_AT_17_30
export const scheduleDoctorAppointmentsInOneDayHandler = CRON_EVERY_DAY_AT_17_30
export const scheduleDoctorAppointmentsOneDayAgoHandler = CRON_EVERY_DAY_AT_17_30
export const scheduleDoctorAppointmentsThreeDaysAgoHandler = CRON_EVERY_DAY_AT_17_30
export const scheduleDiabeticEyeExamInTwoDaysHandler = CRON_EVERY_DAY_AT_17_30
export const scheduleDiabeticEyeExamInTwoWeeksHandler = CRON_EVERY_DAY_AT_17_30
export const scheduleDiabeticEyeExamOneDayAgoHandler = CRON_EVERY_DAY_AT_17_30
export const scheduleDiabeticEyeExamToExpireHandler = CRON_EVERY_DAY_AT_17_30
export const scheduleJourneyTasksDailyHandler = CRON_EVERY_DAY_AT_17_00
export const scheduleScreeningToScheduleHandler = CRON_EVERY_DAY_AT_17_30
export const scheduleMammogramToScheduleHandler = CRON_EVERY_DAY_AT_17_30
export const schedulePapSmearToScheduleHandler = CRON_EVERY_DAY_AT_17_30

export const notificationAppointmentsTypesToNotifiablePeriods = {
  [NotificationType.DoctorAppointmentInTwoWeeks]: 14, // days | in 2 weeks
  [NotificationType.DoctorAppointmentInOneWeek]: 7, // days | in 1 week
  [NotificationType.DoctorAppointmentInOneDay]: 1, // days | in 1 day
  [NotificationType.DoctorAppointmentOneDayAgo]: -1, // days |  1 day ago
  [NotificationType.DoctorAppointmentThreeDaysAgo]: -3, // days | 3 days ago
}

export const notificationEyeExamTypesToNotifiablePeriods = {
  [NotificationType.DiabeticEyeExamInTwoWeeks]: 14,
  [NotificationType.DiabeticEyeExamInTwoDays]: 2,
  [NotificationType.DiabeticEyeExamOneDayAgo]: -1,
}

export enum PredefinedNotificationsSendingStrategy {
  inApp = 'in-app',
  push = 'push',
}
