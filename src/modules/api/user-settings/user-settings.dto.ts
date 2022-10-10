import { DictionaryPathToken } from './../../../constants/dictionary.constants'
import { messageWrapper } from './../../../core/helpers/class-validation'
import { Measurements } from './../../../constants/measurements'
import { Language } from '../../../constants/language'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class LanguageBodyDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsEnum(Language, messageWrapper(DictionaryPathToken.InvalidFormat))
  language: Language
}

export class MeasurementsBodyDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsEnum(Measurements, messageWrapper(DictionaryPathToken.InvalidFormat))
  measurements: Measurements
}
