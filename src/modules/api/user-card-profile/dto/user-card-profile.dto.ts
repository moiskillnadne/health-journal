import { PartialType, PickType } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

export class UserCardProfileParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public noDiabeticEyeExam: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public noBloodPressureCheck: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public needToScheduleAppointment: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public noScheduledAppointment: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public noColonScreening: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public noNeedColonScreening: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public noPapSmear: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public noNeedPapSmear: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public noMammogram: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public noNeedMammogram: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  public averageDailyWaterIntake: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  public averageDailySleepHours: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Min(1)
  @Max(10)
  public sleepQualityRating: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Min(1)
  @Max(10)
  public overallHealthRating: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public hasDepressionOrAnxiety: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public noAnswerOnDepressionOrAnxiety: boolean
}

export class UserCardProfileOptionalParamsDto extends PartialType(UserCardProfileParamsDto) {}

export class UserCardProfileDiabeticEyeExamOptionalParamsDto extends PickType(UserCardProfileOptionalParamsDto, [
  'noDiabeticEyeExam',
] as const) {}

export class UserCardProfileBloodPressureOptionalParamsDto extends PickType(UserCardProfileOptionalParamsDto, [
  'noBloodPressureCheck',
] as const) {}

export class UserCardProfileAppointmentsOptionalParamsDto extends PickType(UserCardProfileOptionalParamsDto, [
  'needToScheduleAppointment',
  'noScheduledAppointment',
] as const) {}

export class UserCardProfileLifestyleOptionalParamsDto extends PickType(UserCardProfileOptionalParamsDto, [
  'averageDailyWaterIntake',
  'averageDailySleepHours',
  'sleepQualityRating',
  'overallHealthRating',
  'hasDepressionOrAnxiety',
  'noAnswerOnDepressionOrAnxiety',
] as const) {}

export class UserCardProfileColonScreeningOptionalParamsDto extends PickType(UserCardProfileOptionalParamsDto, [
  'noColonScreening',
  'noNeedColonScreening',
] as const) {}

export class UserCardProfilePapSmearScreeningOptionalParamsDto extends PickType(UserCardProfileOptionalParamsDto, [
  'noPapSmear',
  'noNeedPapSmear',
] as const) {}

export class UserCardProfileMammogramScreeningOptionalParamsDto extends PickType(UserCardProfileOptionalParamsDto, [
  'noMammogram',
  'noNeedMammogram',
] as const) {}
