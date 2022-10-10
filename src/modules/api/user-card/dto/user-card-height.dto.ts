import { IsNotEmpty, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'
import { PartialType } from '@nestjs/swagger'

export class UserCardHeightParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public ft: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public in: number

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsNumber({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Number)
  public cm: number
}

export class UserCardHeightOptionalParamsDto extends PartialType(UserCardHeightParamsDto) {}
