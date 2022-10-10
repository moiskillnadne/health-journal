import { DictionaryPathToken } from './../../../../constants/dictionary.constants'
import { messageWrapper } from './../../../../core/helpers/class-validation'
import { IsNotEmpty } from 'class-validator'

export class ProfileImageSaveDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  data: string
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  mime: string
}
