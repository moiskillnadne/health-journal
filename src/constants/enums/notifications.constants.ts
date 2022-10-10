import { ascOrDesc, Order } from './pagination.constants'

import { UserSettingsNotificationsEntity } from '../../database/entities/user-settings-notifications.entity'

export enum CustomNotificationPushTypes {
  Video = 'custom_notification_video',
  Article = 'custom_notification_article',
  Recipe = 'custom_notification_recipe',
  Text = 'custom_notification_text',
}

export enum NotificationKind {
  InAppNotification = 'in_app_notification',
  PushNotification = 'push_notification',
}

export enum NotificationType {
  DoctorAppointmentInTwoWeeks = 'doctor_appointment_in_2_weeks',
  DoctorAppointmentInOneWeek = 'doctor_appointment_in_1_week',
  DoctorAppointmentInOneDay = 'doctor_appointment_in_1_day',
  DoctorAppointmentOneDayAgo = 'doctor_appointment_1_day_ago',
  DoctorAppointmentThreeDaysAgo = 'doctor_appointment_3_days_ago',
  DoctorAppointmentToSchedule = 'doctor_appointment_to_schedule',
  DiabeticEyeExamToExpire = 'diabetic_eye_exam_to_expire',
  DiabeticEyeExamToSchedule = 'diabetic_eye_exam_to_schedule',
  DiabeticEyeExamInTwoWeeks = 'diabetic_eye_exam_in_2_weeks',
  DiabeticEyeExamInTwoDays = 'diabetic_eye_exam_in_2_days',
  DiabeticEyeExamOneDayAgo = 'diabetic_eye_exam_1_day_ago',
  Inactivity = 'inactivity',
  TrackTasksAssigned = 'track_tasks_assigned',
  TrackTasksUpdated = 'track_tasks_updated',
  BloodPressureGoal = 'blood_pressure_goal',
  Hba1cGoal = 'hba1c_goal',
  BloodSugarFastingGoal = 'blood_sugar_fasting_goal',
  RandomBloodSugarGoal = 'random_blood_sugar_goal',
  BloodSugarAfterMealGoal = 'blood_sugar_after_meal_goal',
  LdlGoal = 'ldl_goal',
  WeightGoal = 'weight_goal',
  MedicationOffGoal = 'medication_off_goal',
  WaterIntakeGoal = 'water_intake_goal',
  ColonScreeningToExpire = 'colon_screening_to_expire',
  ColonScreeningToSchedule = 'colon_screening_to_schedule',
  MammogramToExpire = 'mammogram',
  MammogramToSchedule = 'mammogram_to_schedule',
  PapSmearToExpire = 'pap_smear',
  PapSmearToSchedule = 'pap_smear_to_schedule',
  OtherProcedureToExpire = 'other_procedure_to_expire',
  OtherProcedureToSchedule = 'other_procedure_to_schedule',
}

export const NotificationToExpireTypes = [
  NotificationType.ColonScreeningToExpire,
  NotificationType.MammogramToExpire,
  NotificationType.PapSmearToExpire,
]

export const NotificationTypeToSettingsColumn: Partial<
  Record<NotificationType, keyof UserSettingsNotificationsEntity>
> = {
  [NotificationType.ColonScreeningToSchedule]: 'colonScreeningEnable',
  [NotificationType.MammogramToSchedule]: 'mammogramEnable',
  [NotificationType.PapSmearToSchedule]: 'papSmearEnable',
}

export const NotificationTypeToRemindType: Partial<Record<NotificationType, NotificationType>> = {
  [NotificationType.DoctorAppointmentOneDayAgo]: NotificationType.DoctorAppointmentToSchedule,
  [NotificationType.DoctorAppointmentToSchedule]: NotificationType.DoctorAppointmentToSchedule,
  [NotificationType.DiabeticEyeExamToExpire]: NotificationType.DiabeticEyeExamToSchedule,
  [NotificationType.DiabeticEyeExamToSchedule]: NotificationType.DiabeticEyeExamToSchedule,
  [NotificationType.DiabeticEyeExamOneDayAgo]: NotificationType.DiabeticEyeExamToSchedule,
  [NotificationType.ColonScreeningToExpire]: NotificationType.ColonScreeningToSchedule,
  [NotificationType.ColonScreeningToSchedule]: NotificationType.ColonScreeningToSchedule,
  [NotificationType.MammogramToExpire]: NotificationType.MammogramToSchedule,
  [NotificationType.MammogramToSchedule]: NotificationType.MammogramToSchedule,
  [NotificationType.PapSmearToExpire]: NotificationType.PapSmearToSchedule,
  [NotificationType.PapSmearToSchedule]: NotificationType.PapSmearToSchedule,
  [NotificationType.OtherProcedureToExpire]: NotificationType.OtherProcedureToSchedule,
  [NotificationType.OtherProcedureToSchedule]: NotificationType.OtherProcedureToSchedule,
}

export enum CustomNotificationSendingStrategy {
  Immediately = 'immediately',
  Scheduled = 'scheduled',
}

export enum CustomNotificationStatus {
  Completed = 'completed',
  Scheduled = 'scheduled',
}

export const customNotificationContentMaxLen = 5000
export const customNotificationNameMaxLen = 128
export const defaultOrderCustom = Order.DESC
export const defaultOrderFieldCustom = 'updateAt'
export const defaultOrderValueCustom = `${defaultOrderFieldCustom} ${defaultOrderCustom}`
export const allowedOrderFieldsCustom = ['createAt', 'updateAt']
/**
 * pattern: ^( *(createAt|updateAt)( +(ASC|DESC|asc|desc))))$
 * Allowed values:
 * createAt
 * createAt asc
 * createAt desc
 * updateAt
 * updateAt asc
 * updateAt desc
 */
export const orderFieldPatternCustom = new RegExp(`^( *(${allowedOrderFieldsCustom.join('|')})( +${ascOrDesc}))$`)

export const predefinedNotificationContentMaxLen = 5000
export const defaultOrderPredefined = Order.DESC
export const defaultOrderFieldPredefined = 'updateAt'
export const defaultOrderValuePredefined = `${defaultOrderFieldPredefined} ${defaultOrderPredefined}`
export const allowedOrderFieldsPredefined = ['createAt', 'updateAt']
/**
 * pattern: ^( *(createAt|updateAt)( +(ASC|DESC|asc|desc))))$
 * Allowed values:
 * createAt
 * createAt asc
 * createAt desc
 * updateAt
 * updateAt asc
 * updateAt desc
 */
export const orderFieldPatternPredefined = new RegExp(
  `^( *(${allowedOrderFieldsPredefined.join('|')})( +${ascOrDesc}))$`,
)
