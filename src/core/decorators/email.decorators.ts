import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsEmail } from 'class-validator'
import { DictionaryPathToken } from '../../constants/dictionary.constants'
import { messageWrapper } from '../helpers/class-validation'

export function IsEmailCustom() {
  return applyDecorators(
    Transform(({ value }) => value?.toLowerCase()),
    IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty)),
    IsEmail({}, messageWrapper(DictionaryPathToken.InvalidFormat)),
  )
}
