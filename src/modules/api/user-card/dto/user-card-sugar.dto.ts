import { PartialType } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

export class UserCardSugarParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public mgDl: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public mmolL: number
}

export class UserCardSugarDateParamsDto extends UserCardSugarParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  public datetime: Date
}

export class UserCardSugarOptionalParamsDto extends PartialType(UserCardSugarParamsDto) {}

export class UserCardSugarDateOptionalParamsDto extends PartialType(UserCardSugarDateParamsDto) {}
