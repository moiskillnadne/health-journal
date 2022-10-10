import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator'
import { Type } from 'class-transformer'

import { ReminderPeriod } from '../../../../constants/enums/reminders.constants'
import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

export class UserProceduresParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsUUID(4, messageWrapper(DictionaryPathToken.InvalidFormat))
  public id: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  @MaxLength(128)
  public name: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  public datetime: Date
}

export class UserProceduresRepeatParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Min(1)
  @Max(11)
  @Type(() => Number)
  public interval: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsEnum(ReminderPeriod, messageWrapper(DictionaryPathToken.InvalidFormat))
  public period: ReminderPeriod
}

export class UserProceduresOptionalParamsDto extends PartialType(UserProceduresParamsDto) {}
export class UserProceduresRepeatOptionalParamsDto extends PartialType(UserProceduresRepeatParamsDto) {}

export class UserProceduresBodyParamsDto extends IntersectionType(
  PickType(UserProceduresOptionalParamsDto, ['id', 'name', 'datetime'] as const),
  UserProceduresRepeatOptionalParamsDto,
) {}
