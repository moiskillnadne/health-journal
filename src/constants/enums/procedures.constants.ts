import { ReminderPeriod } from './reminders.constants'
import { NotificationType } from './notifications.constants'

export const defaultProceduresFrequency = 11

export enum Procedure {
  DiabeticEyeExam = 'diabeticEyeExam',
  BloodStoolTesting = 'bloodStoolTesting',
  Cologuard = 'cologuard',
  Colonoscopy = 'colonoscopy',
  Colonography = 'colonography',
  PapSmear = 'papSmear',
  Mammogram = 'mammogram',
  Other = 'other',
}

export const ProcedureToNotificationBlankType = {
  [Procedure.DiabeticEyeExam]: NotificationType.DiabeticEyeExamToSchedule,
  [Procedure.BloodStoolTesting]: NotificationType.ColonScreeningToSchedule,
  [Procedure.Cologuard]: NotificationType.ColonScreeningToSchedule,
  [Procedure.Colonoscopy]: NotificationType.ColonScreeningToSchedule,
  [Procedure.Colonography]: NotificationType.ColonScreeningToSchedule,
  [Procedure.PapSmear]: NotificationType.PapSmearToSchedule,
  [Procedure.Mammogram]: NotificationType.MammogramToSchedule,
}

export const ProcedureToNotificationExpireType = {
  [Procedure.DiabeticEyeExam]: NotificationType.DiabeticEyeExamToExpire,
  [Procedure.BloodStoolTesting]: NotificationType.ColonScreeningToExpire,
  [Procedure.Cologuard]: NotificationType.ColonScreeningToExpire,
  [Procedure.Colonoscopy]: NotificationType.ColonScreeningToExpire,
  [Procedure.Colonography]: NotificationType.ColonScreeningToExpire,
  [Procedure.PapSmear]: NotificationType.PapSmearToExpire,
  [Procedure.Mammogram]: NotificationType.MammogramToExpire,
  [Procedure.Other]: NotificationType.OtherProcedureToExpire,
}

export const ProcedureRemindOptions = {
  Weeks: ReminderPeriod.Week,
  Months: ReminderPeriod.Month,
  'Year(s)': ReminderPeriod.Year,
}
