import { DictionaryPathToken } from './../../../../constants/dictionary.constants'
import { messageWrapper } from './../../../../core/helpers/class-validation'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { ADDITIONAL_INFORMATION_MAX_LENGTH } from '../../../../constants/enums/additional-information.constants'

export class PutAdditionalInformationParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.IsString))
  @MaxLength(ADDITIONAL_INFORMATION_MAX_LENGTH, messageWrapper(DictionaryPathToken.InvalidFormat))
  value: string
}
