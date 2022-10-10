import { applyDecorators } from '@nestjs/common'
import { Matches, MinLength } from 'class-validator'
import { DictionaryPathToken } from '../../constants/dictionary.constants'
import { passwordRequiredRulesRegExp, PASSWORD_MIN_LENGTH } from '../../constants/validations/user.constants'
import { messageWrapper } from '../helpers/class-validation'

export function IsPasswordCustom() {
  return applyDecorators(
    MinLength(PASSWORD_MIN_LENGTH, messageWrapper(DictionaryPathToken.PasswordMinLength)),
    Matches(passwordRequiredRulesRegExp, messageWrapper(DictionaryPathToken.PasswordInvalidFormat)),
  )
}
