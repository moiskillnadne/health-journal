import { PartialType, IntersectionType } from '@nestjs/swagger'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { IntervalPeriod } from '../../../../constants/enums/period.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

import { UserCardGoalPressureOptionalParamsDto } from '../../user-card/dto/user-card.dto'

export class UserCardBloodPressureParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public systolic: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public diastolic: number
}

export class UserCardBloodPressureDateParamsDto extends UserCardBloodPressureParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  public datetime: Date
}

export class UserCardBloodPressureOptionalParamsDto extends PartialType(UserCardBloodPressureDateParamsDto) {}

export class UserCardBloodPressureParentParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardBloodPressureOptionalParamsDto)
  public bloodPressure: UserCardBloodPressureOptionalParamsDto
}

export class UserCardBloodPressureParentOptionalParamsDto extends PartialType(UserCardBloodPressureParentParamsDto) {}

export class UserCardBloodPressureQueryParamsDto {
  @IsOptional()
  @IsEnum(IntervalPeriod, messageWrapper(DictionaryPathToken.InvalidFormat))
  public period?: IntervalPeriod
}

export class UserCardBloodPressureSaveBodyParamsDTO extends IntersectionType(
  UserCardBloodPressureOptionalParamsDto,
  UserCardGoalPressureOptionalParamsDto,
) {}
