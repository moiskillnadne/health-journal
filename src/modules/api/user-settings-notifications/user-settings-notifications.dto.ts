import { DictionaryPathToken } from './../../../constants/dictionary.constants'
import { messageWrapper } from './../../../core/helpers/class-validation'
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'

export class GetNotificationsBody {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  userId: string
}

export class UserBodyDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  id: string
}

export class NotificationsDTO {
  @IsOptional()
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  pushNotificationsEnable: boolean

  @IsOptional()
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  scheduleAnAppointmentEnable: boolean

  @IsOptional()
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  waterIntakeEnable: boolean

  @IsOptional()
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  vitalsCheckEnable: boolean

  @IsOptional()
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  myWellnessJourneytasksEnable: boolean

  @IsOptional()
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  eyeExamEnable: boolean

  @IsOptional()
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  newsAndUpdatesEnable: boolean

  @IsOptional()
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  doctorAppointmentsEnable: boolean

  @IsOptional()
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  medicationRemindersEnable: boolean

  @IsOptional()
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  screeningTestsEnable: boolean
}

export class UpdateNotificationsBodyDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  user: UserBodyDTO

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  notifications: NotificationsDTO
}
