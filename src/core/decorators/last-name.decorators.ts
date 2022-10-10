import { applyDecorators } from '@nestjs/common'
import { IsNotEmpty, IsString } from 'class-validator'
import { DictionaryPathToken } from '../../constants/dictionary.constants'
import { messageWrapper } from '../helpers/class-validation'

export function IsLastNameCustom() {
  return applyDecorators(
    IsNotEmpty(messageWrapper(DictionaryPathToken.LastNameNotEmpty)),
    IsString(messageWrapper(DictionaryPathToken.LastNameIsString)),
  )
}
