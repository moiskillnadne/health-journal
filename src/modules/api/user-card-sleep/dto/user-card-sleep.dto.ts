import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

import { UserCardOptionalParamsDto } from '../../user-card/dto/user-card.dto'

export class UserCardSleepParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public sleepHours: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  public datetime: Date
}

export class UserCardSleepOptionalParamsDto extends PartialType(UserCardSleepParamsDto) {}

export class UserCardSleepBodyParamsDto extends IntersectionType(
  UserCardSleepOptionalParamsDto,
  PickType(UserCardOptionalParamsDto, ['sleepGoal'] as const),
) {}
