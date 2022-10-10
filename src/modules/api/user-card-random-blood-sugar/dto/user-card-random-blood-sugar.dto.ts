import { PartialType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { IntervalPeriod } from '../../../../constants/enums/period.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

import {
  UserCardSugarDateOptionalParamsDto,
  UserCardSugarOptionalParamsDto,
} from '../../user-card/dto/user-card-sugar.dto'

export class UserCardRandomBloodSugarParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarDateOptionalParamsDto)
  public randomBloodSugar: UserCardSugarDateOptionalParamsDto
}

export class UserCardRandomBloodSugarOptionalParamsDto extends PartialType(UserCardRandomBloodSugarParamsDto) {}

export class UserCardRandomBloodSugarQueryParamsDto {
  @IsOptional()
  @IsEnum(IntervalPeriod, messageWrapper(DictionaryPathToken.InvalidFormat))
  public period?: IntervalPeriod
}

export class RandomBloodSugarWithGoalParamsDto extends UserCardRandomBloodSugarParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarOptionalParamsDto)
  public goalRandomBloodSugar: UserCardSugarOptionalParamsDto
}
