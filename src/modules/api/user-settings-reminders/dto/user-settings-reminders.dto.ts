import { PartialType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { ReminderTimePeriod } from '../../../../constants/enums/reminders.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

export class UserSettingsRemindersParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public waterInterval: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsEnum(ReminderTimePeriod, messageWrapper(DictionaryPathToken.InvalidFormat))
  public waterPeriod: ReminderTimePeriod

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  public waterFrom: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  public waterTo: string
}

export class UserSettingsRemindersOptionalParamsDto extends PartialType(UserSettingsRemindersParamsDto) {}

export class UserSettingsRemindersBodyParamsDto extends UserSettingsRemindersOptionalParamsDto {}
