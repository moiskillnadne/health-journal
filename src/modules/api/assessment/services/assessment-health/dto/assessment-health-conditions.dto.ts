import { IsString, IsUUID } from 'class-validator'

import { messageWrapper } from '../../../../../../core/helpers/class-validation'
import { DictionaryPathToken } from '../../../../../../constants/dictionary.constants'

export class OtherConditionParamsDto {
  @IsUUID(4, messageWrapper(DictionaryPathToken.InvalidFormat))
  conditionId: string

  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  name: string
}

export class ConditionsParamsDto {
  @IsUUID(4, { each: true, ...messageWrapper(DictionaryPathToken.InvalidFormat) })
  public id?: string

  public info?: string
}
