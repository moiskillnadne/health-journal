import { DictionaryPathToken } from './../../../constants/dictionary.constants'
import { messageWrapper } from './../../../core/helpers/class-validation'
import { IsString, MaxLength } from 'class-validator'
import { MAX_EMAIL_BODY_LENGTH } from '../../../constants/validations/support.constants'

export class SendEmailDTO {
  @MaxLength(MAX_EMAIL_BODY_LENGTH, messageWrapper(DictionaryPathToken.EmailBodyMaxLength))
  @IsString(messageWrapper(DictionaryPathToken.IsString))
  emailBody!: string
}

export class EmailDetailsDTO {
  username!: string
  email!: string
  emailBody!: string
}
