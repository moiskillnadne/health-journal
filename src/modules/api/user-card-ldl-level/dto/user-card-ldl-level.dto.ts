import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

import { UserCardCholesterolDateOptionalParamsDto } from '../../user-card/dto/user-card-cholesterol.dto'
import { UserCardParamsDto } from '../../user-card/dto/user-card.dto'
import { IntervalPeriod } from '../../../../constants/enums/period.constants'

export class UserCardLdlLevelParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardCholesterolDateOptionalParamsDto)
  public ldl: UserCardCholesterolDateOptionalParamsDto
}

export class UserCardLdlLevelOptionalParamsDto extends PartialType(UserCardLdlLevelParamsDto) {}

export class PostUserCardLdlLevelParamsDto extends IntersectionType(
  UserCardLdlLevelParamsDto,
  PickType(UserCardParamsDto, ['goalLdl']),
) {}

export class UserCardLdlLevelQueryParamsDto {
  @IsOptional()
  @IsEnum(IntervalPeriod, messageWrapper(DictionaryPathToken.InvalidFormat))
  public period?: IntervalPeriod
}
