import { ILocalization } from './localization.models'
import { UserAdminEntity } from '../database/entities/user-admin.entity'
import { UserEntity } from '../database/entities/user.entity'

export interface ISignUpBodyModel extends ILocalization {
  username: string
  email: string
  password: string
}

export interface IResendConfirmationBody extends ILocalization {
  username: string
}

export interface IConfirmEmailBodyModel extends ILocalization {
  username: string
  code: string
}

export interface ILogInBodyModel extends ILocalization {
  username: string
  password: string
}

export interface IConfirmRestorePassword extends ILocalization {
  email: string
  code: string
  newPassword: string
}

export interface ILogoutBodyModel extends ILocalization {
  accessToken: string
}

export interface IIsUserExist {
  method: string
  user: UserAdminEntity | UserEntity
}

export interface ISignInResponse {
  accessToken: string
  expiresIn: number
  tokenType: string
  refreshToken: string
  idToken: string
  user: UserAdminEntity
}

export interface IRefreshResponse {
  accessToken: string
  expiresIn: number
  tokenType: string
  idToken: string
}
