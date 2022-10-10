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

export class UserCardAfterMealBloodSugarParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarDateOptionalParamsDto)
  public afterMealBloodSugar: UserCardSugarDateOptionalParamsDto
}

export class UserCardAfterMealBloodSugarOptionalParamsDto extends PartialType(UserCardAfterMealBloodSugarParamsDto) {}

export class UserCardAfterMealBloodSugarQueryParamsDto {
  @IsOptional()
  @IsEnum(IntervalPeriod, messageWrapper(DictionaryPathToken.InvalidFormat))
  public period?: IntervalPeriod
}

export class PostUserCardAfterMealBloodSugarParamsDto extends UserCardAfterMealBloodSugarParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardSugarOptionalParamsDto)
  public goalAfterMealBloodSugar: UserCardSugarOptionalParamsDto
}
