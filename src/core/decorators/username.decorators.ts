import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { DictionaryPathToken } from '../../constants/dictionary.constants'
import { messageWrapper } from '../helpers/class-validation'

export function IsUsernameCustom() {
  return applyDecorators(
    Transform(({ value }) => value?.toLowerCase()),
    IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty)),
  )
}
