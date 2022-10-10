import { Procedure } from '../procedures.constants'

export const MaxUserInactivePeriod = 1 // 1 year

export enum AnalyticReportAlias {
  dateOfBirth = 'dateOfBirth',
  gender = 'gender',
  race = 'race',
  location = 'location',
  chronicDiseases = 'chronic_diseases',
  medications = 'medications',
  bloodPressure = 'blood_pressure',
  weight = 'weight',
  ldl = 'ldl',
  bloodSugarAfterMeal = 'blood_sugar_after_meal',
  hba1c = 'hba1c',
  triglyceride = 'triglyceride',
  expectations = 'expectations',
  doctorAppointments = 'doctor_appointments',
  procedures = 'procedures',
}

export enum AnalyticReportContentType {
  csv = 'text/csv',
  zip = 'application/zip',
}

export class UsersSignedUpPeriod {
  from?: Date
  to?: Date
}

export class AnalyticReportFilter {
  signedUpPeriod: UsersSignedUpPeriod
  reportDate?: Date
  companyCode?: string
}

export const AnalyticArchiveDefaultName = 'Reports'

export const AnalyticProcedureReportAllowedAliases: Procedure[] = [
  Procedure.Colonoscopy,
  Procedure.Mammogram,
  Procedure.PapSmear,
]

export const AnalyticProcedureAliasToCsvFormatted: Partial<Record<Procedure, string>> = {
  [Procedure.DiabeticEyeExam]: 'Diabetic Eye Exam',
  [Procedure.BloodStoolTesting]: 'Blood Stool Testing',
  [Procedure.Cologuard]: 'Cologuard',
  [Procedure.Colonoscopy]: 'Colonoscopy',
  [Procedure.Colonography]: 'Colonography',
  [Procedure.PapSmear]: 'Pap Smear',
  [Procedure.Mammogram]: 'Mammogram',
}
