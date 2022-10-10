import { DictionaryPathToken } from './../../constants/dictionary.constants'
import { IsNotEmpty, IsString } from 'class-validator'
import { IsCodeCustom } from '../../core/decorators/confirmation-code.decorators'
import { IsEmailCustom } from '../../core/decorators/email.decorators'
import { IsPasswordCustom } from '../../core/decorators/password.decorators'
import { IsUsernameCustom } from '../../core/decorators/username.decorators'
import { messageWrapper } from '../../core/helpers/class-validation'
import { IsFirstNameCustom } from '../../core/decorators/first-name.decorators'
import { IsLastNameCustom } from '../../core/decorators/last-name.decorators'

export class AdminSignupDTO {
  @IsEmailCustom()
  email: string

  @IsUsernameCustom()
  username: string

  @IsPasswordCustom()
  password: string

  @IsFirstNameCustom()
  firstName: string

  @IsLastNameCustom()
  lastName: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.IsString))
  secretToken: string
}

export class AdminLoginDTO {
  @IsEmailCustom()
  email: string

  @IsPasswordCustom()
  password: string
}

export class AdminRefreshDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  refreshToken: string
}

export class AdminRestoreDTO {
  @IsEmailCustom()
  email: string
}

export class AdminConfirmRestorePasswordDTO {
  @IsEmailCustom()
  email: string

  @IsCodeCustom()
  code: string

  @IsPasswordCustom()
  newPassword: string
}
