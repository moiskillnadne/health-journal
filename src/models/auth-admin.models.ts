import { ILocalization } from './localization.models'
import { IUserAdminModelResponse } from './user-admin.models'

export interface ISignupAdminBody extends ILocalization {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  secretToken: string
}

export interface ILoginAdminBody extends ILocalization {
  email: string
  password: string
}

export interface IConfirmRestorePasswordAdminBody extends ILocalization {
  email: string
  code: string
  newPassword: string
}

export interface IRefreshAdminBody {
  refreshToken: string
}

export interface ISignInAdminResponse {
  accessToken: string
  expiresIn: number
  tokenType: string
  refreshToken: string
  idToken: string
  user: IUserAdminModelResponse
}
