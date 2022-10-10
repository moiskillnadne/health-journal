import { PartialType } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

export class UserCardWeightParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public lb: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public kg: number
}

export class UserCardWeightOptionalParamsDto extends PartialType(UserCardWeightParamsDto) {}

export class UserCardWeightWithDateParamsDto extends UserCardWeightOptionalParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  datetime: Date
}
