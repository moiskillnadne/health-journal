import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'
import { IntervalPeriod } from '../../../../constants/enums/period.constants'

import { UserCardCholesterolDateOptionalParamsDto } from '../../user-card/dto/user-card-cholesterol.dto'
import { UserCardParamsDto } from '../../user-card/dto/user-card.dto'

export class UserCardTriglycerideLevelParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardCholesterolDateOptionalParamsDto)
  public triglyceride: UserCardCholesterolDateOptionalParamsDto
}

export class UserCardTriglycerideLevelOptionalParamsDto extends PartialType(UserCardTriglycerideLevelParamsDto) {}

export class PostUserCardTriglycerideLevelParamsDto extends IntersectionType(
  UserCardTriglycerideLevelParamsDto,
  PickType(UserCardParamsDto, ['goalTriglyceride']),
) {}

export class UserCardTriglycerideLevelPeriodParamsDto {
  @IsOptional()
  @IsEnum(IntervalPeriod, messageWrapper(DictionaryPathToken.InvalidFormat))
  public period?: IntervalPeriod
}
