import { PartialType } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

export class UserJourneySurveyParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public reverseOrBetterManage: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public loseWeight: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public improveLabWorkWithoutMedications: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public feelBetter: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public lowerHealthcareCost: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public decreaseOrGetOffMedications: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public none: boolean
}

export class UserJourneySurveyOptionalParamsDto extends PartialType(UserJourneySurveyParamsDto) {}
