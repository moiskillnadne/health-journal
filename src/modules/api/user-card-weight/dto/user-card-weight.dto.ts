import { PartialType, PickType, IntersectionType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { IntervalPeriod } from '../../../../constants/enums/period.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

import {
  UserCardWeightOptionalParamsDto,
  UserCardWeightWithDateParamsDto,
} from '../../user-card/dto/user-card-weight.dto'
import { UserCardParamsDto } from '../../user-card/dto/user-card.dto'

export class UserCardWeightParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardWeightOptionalParamsDto)
  public weight: UserCardWeightOptionalParamsDto
}

export class UserCardWeightDateParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardWeightWithDateParamsDto)
  public weight: UserCardWeightWithDateParamsDto
}

export class UserCardWeightHistoryOptionalParamsDto extends PartialType(UserCardWeightParamsDto) {}

export class UserCardWeightHistoryQueryParamsDto {
  @IsOptional()
  @IsEnum(IntervalPeriod, messageWrapper(DictionaryPathToken.InvalidFormat))
  public period?: IntervalPeriod
}

export class PostUserCardWeightParamsDto extends IntersectionType(
  PickType(UserCardParamsDto, ['goalWeight'] as const),
  UserCardWeightDateParamsDto,
) {}
