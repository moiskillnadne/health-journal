import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { IntervalPeriod } from '../../../../constants/enums/period.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

import { UserCardEntity } from '../../../../database/entities/user-card.entity'

export class UserCardHba1cParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public percent: number
}

export class UserCardHba1cOptionalParamsDto extends PartialType(UserCardHba1cParamsDto) {}

export class UserCardHba1cDateParamsDto extends UserCardHba1cParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  public datetime: Date
}

export class UserCardHba1cDateOptionalParamsDto extends PartialType(UserCardHba1cDateParamsDto) {}

export class UserCardHba1cParentParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @ValidateNested()
  @Type(() => UserCardHba1cDateOptionalParamsDto)
  public hba1c: UserCardHba1cDateOptionalParamsDto
}

export class UserCardHba1cHistoryOptionalParamsDto extends PartialType(UserCardHba1cParentParamsDto) {}

export class UserCardHba1cQueryParamsDto {
  @IsOptional()
  @IsEnum(IntervalPeriod, messageWrapper(DictionaryPathToken.InvalidFormat))
  public period?: IntervalPeriod
}

export class PostUserCardHba1cHistoryParamsDto extends IntersectionType(
  UserCardHba1cParentParamsDto,
  PickType(UserCardEntity, ['goalHba1c'] as const),
) {}
