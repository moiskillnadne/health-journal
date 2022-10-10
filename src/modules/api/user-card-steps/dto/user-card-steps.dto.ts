import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsDate } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { IntervalPeriod } from '../../../../constants/enums/period.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

import { PaginationOptionsDTO } from '../../../../core/dtos/pagination'

import { UserCardOptionalParamsDto } from '../../user-card/dto/user-card.dto'

export class UserCardStepsParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @IsPositive(messageWrapper(DictionaryPathToken.ValueGreaterThanZero))
  @Type(() => Number)
  public steps: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  public datetime: Date
}

export class UserCardStepsOptionalParamsDto extends PartialType(UserCardStepsParamsDto) {}

export class UserCardStepsQueryParamsDto extends PaginationOptionsDTO {
  @IsOptional()
  @IsEnum(IntervalPeriod, messageWrapper(DictionaryPathToken.InvalidFormat))
  public period?: IntervalPeriod
}

export class UserCardStepsBodyParamsDto extends IntersectionType(
  UserCardStepsOptionalParamsDto,
  PickType(UserCardOptionalParamsDto, ['goalSteps'] as const),
) {}
