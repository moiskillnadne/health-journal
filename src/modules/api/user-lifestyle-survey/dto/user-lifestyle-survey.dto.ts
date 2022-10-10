import { PartialType } from '@nestjs/swagger'
import { IsBoolean, IsString, IsNotEmpty } from 'class-validator'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

export class UserLifestyleSurveyParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public money: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public time: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public energy: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public socialLife: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public unsureWhatToDo: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public emotionalConnectWithFoodDrinks: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsBoolean(messageWrapper(DictionaryPathToken.IsBool))
  public liveHealthyLifestyle: boolean

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  public other: string
}

export class UserLifestyleSurveyOptionalParamsDto extends PartialType(UserLifestyleSurveyParamsDto) {}
