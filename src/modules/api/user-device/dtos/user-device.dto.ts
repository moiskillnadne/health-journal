import { IsNotEmpty } from 'class-validator'
import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'

export class PostUserDeviceParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  public fcmToken!: string
}

export class DeleteUserDeviceParamsDto extends PostUserDeviceParamsDto {}
