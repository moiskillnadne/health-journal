import { DictionaryPathToken } from './../../constants/dictionary.constants'
import { messageWrapper } from './../../core/helpers/class-validation'
import { IsNotEmpty } from 'class-validator'
import { IsEmailCustom } from '../../core/decorators/email.decorators'
import { IsUsernameCustom } from '../../core/decorators/username.decorators'
import { IsPasswordCustom } from '../../core/decorators/password.decorators'
import { IsCodeCustom } from '../../core/decorators/confirmation-code.decorators'
import { PickType } from '@nestjs/swagger'
import { UserEntity } from '../../database/entities/user.entity'

export class SignUpBodyDTO {
  @IsEmailCustom()
  email: string

  @IsUsernameCustom()
  username: string

  @IsPasswordCustom()
  password: string
}

export class ResendConfirmationCodeDTO {
  @IsUsernameCustom()
  username: string
}

export class ConfirmEmailDTO {
  @IsUsernameCustom()
  username: string

  @IsCodeCustom()
  code: string
}

export class LogInDTO {
  @IsUsernameCustom()
  username: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.PasswordNotEmpty))
  password: string
}

export class RefreshDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  refreshToken: string
}

export class RestorePasswordDTO {
  @IsEmailCustom()
  email: string
}

export class ConfirmRestorePasswordDTO {
  @IsEmailCustom()
  email: string

  @IsCodeCustom()
  code: string

  @IsPasswordCustom()
  newPassword: string
}

export class LogoutDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  accessToken: string
}

export class UserResponse extends PickType(UserEntity, [
  'id',
  'createAt',
  'email',
  'username',
  'firstName',
  'lastName',
  'dateOfBirth',
  'cognitoId',
  'country',
  'state',
  'city',
  'genderId',
  'raceId',
]) {}
