import { DictionaryPathToken } from './../../../constants/dictionary.constants'
import { Environment } from './../../../constants/config.constants'
import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AWSError } from 'aws-sdk'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { DictionaryErrorMessages } from '../../../constants/responses/messages.error.constants'
import { BadRequestError } from '../../../core/errors/bad-request.error'
import { InternalServerError } from '../../../core/errors/internal-server.error'
import { CognitoAdminService } from '../../../integrations/cognito/services/cognito-admin.service'
import {
  IConfirmRestorePasswordAdminBody,
  ILoginAdminBody,
  IRefreshAdminBody,
  ISignInAdminResponse,
  ISignupAdminBody,
} from '../../../models/auth-admin.models'
import { IIsUserExist, IRefreshResponse } from '../../../models/auth.models'
import { IUserAttributes } from '../../../models/cognito.models'
import { IUserModelResponse } from '../../../models/user.models'
import { UserAdminEntityBaseService } from './entity/admin-auth.entity.service'
import { ForbiddenError } from '../../../core/errors/forbidden.error'
import { NotFoundError } from '../../../core/errors/not-found.error'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { IBaseResponse } from '../../../models/response.models'
import { I18nContext } from 'nestjs-i18n'
import { CognitoErrorResponseCodes } from '../../../constants/integrations/cognito-error-codes'
import { FailedLoginService } from './failed-login.service'
import { failedLoginAttemptsLimit } from '../../../constants/enums/admin/auth.constants'

@Injectable()
export class AuthAdminService {
  private readonly logger = new Logger(AuthAdminService.name)

  constructor(
    protected cognitoAdminService: CognitoAdminService,
    private authAdminUserService: UserAdminEntityBaseService,
    protected configService: ConfigService,
    private failedLoginService: FailedLoginService,
  ) {}

  public async signUp(body: ISignupAdminBody): Promise<IUserModelResponse | AWSError> {
    const { email, username, secretToken, firstName, lastName, i18n } = body

    if (secretToken !== this.configService.get(Environment.WebAdminAccessToken)) {
      throw new ForbiddenError(
        i18n.t(DictionaryPathToken.AccessToAdminPanelDenied),
        ErrorCodes.AccessAdminDenied,
        HttpStatus.FORBIDDEN,
      )
    }

    const isExist = await this.isUsernameExist(email, username)
    if (isExist.length === 2) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserByEmailAndUsernameExist),
        ErrorCodes.UserAlreadyExist,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (isExist.length === 1) {
      const exception =
        isExist[0].method === 'username'
          ? i18n.t(DictionaryPathToken.UserByUsernameExist)
          : i18n.t(DictionaryPathToken.UserByEmailExist)

      throw new BadRequestError(exception, ErrorCodes.UserAlreadyExist, HttpStatus.BAD_REQUEST)
    }

    const userAttr = this.createUserAttr({
      email: email,
      nickname: username,
    })

    const cognitoResult = await this.cognitoAdminService.signUp(body, userAttr)

    if (!cognitoResult['UserSub']) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          UserSub: 'User sub was not provided by AWS',
        },
      )
    }

    return await this.authAdminUserService.saveUser({
      email,
      username,
      cognitoId: cognitoResult['UserSub'],
      firstName,
      lastName,
    })
  }

  public async loginAdmin(loginBody: ILoginAdminBody): Promise<ISignInAdminResponse | AWSError> {
    const { email, password, i18n } = loginBody

    const userByEmail = await this.authAdminUserService.getUserByEmail(email)

    if (!userByEmail) {
      throw new NotFoundError(
        i18n.t(DictionaryPathToken.UserByEmailNotFound),
        ErrorCodes.InvalidUserCredentials,
        HttpStatus.BAD_REQUEST,
        {
          message: DictionaryErrorMessages.UserWithEmailNotFound,
        },
      )
    }

    if (!userByEmail.isActive) {
      throw new ForbiddenError(
        i18n.t(DictionaryPathToken.AccessToAdminPanelDeniedInactiveUser),
        ErrorCodes.AccessAdminDenied,
        HttpStatus.FORBIDDEN,
      )
    }

    if (this.failedLoginService.isUserBlocked(userByEmail)) {
      if (this.failedLoginService.isBlockTimeOver(userByEmail.lastLoginAttemptAt)) {
        await this.authAdminUserService.resetLoginFailedAttemptsCount(userByEmail)
      } else {
        throw new ForbiddenError(
          i18n.t(DictionaryPathToken.AdminUserTemporarilyBlockedFailedLoginAttempts),
          ErrorCodes.AdminUserTemporarilyBlocked,
          HttpStatus.FORBIDDEN,
        )
      }
    }

    let cognitoResult
    try {
      cognitoResult = await this.cognitoAdminService.login(email, password)
    } catch (e) {
      if (e.code === CognitoErrorResponseCodes.NotAuthorized) {
        if (this.failedLoginService.isLimitFailedLogin(userByEmail)) {
          await this.authAdminUserService.updateLastLoginAttemptAt(userByEmail)
          this.logger.log(`User ${userByEmail.email} has ${failedLoginAttemptsLimit} failed attempts to login`)
          try {
            this.logger.log(`Notify user: ${userByEmail.email}`)
            await this.failedLoginService.notifyUserFailedLoginAttempts(userByEmail)
          } catch (e) {
            this.logger.error(`Got error: ${e}`)
          }
        }
        await this.authAdminUserService.incrementLoginFailedAttempt(userByEmail)
        throw new BadRequestError(
          i18n.t(DictionaryPathToken.UserInvalidCredentials),
          ErrorCodes.InvalidUserCredentials,
          HttpStatus.BAD_REQUEST,
          {
            ...e,
          },
        )
      }

      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }

    const { AccessToken, ExpiresIn, TokenType, RefreshToken, IdToken } = cognitoResult['AuthenticationResult']
    await this.authAdminUserService.successLoginUpdates(userByEmail)

    return {
      accessToken: AccessToken,
      expiresIn: ExpiresIn,
      tokenType: TokenType,
      refreshToken: RefreshToken,
      idToken: IdToken,
      user: userByEmail,
    }
  }

  public async refreshTokenAdmin(refreshBody: IRefreshAdminBody): Promise<IRefreshResponse> {
    const { refreshToken } = refreshBody
    const cognitoResult = await this.cognitoAdminService.refresh(refreshToken)
    const { AccessToken, ExpiresIn, TokenType, IdToken } = cognitoResult['AuthenticationResult']
    return {
      idToken: IdToken,
      accessToken: AccessToken,
      expiresIn: ExpiresIn,
      tokenType: TokenType,
    }
  }

  public async restorePasswordAdmin(email: string, i18n: I18nContext): Promise<IBaseResponse> {
    const cognitoResult = await this.cognitoAdminService.restorePassword(email)
    return {
      code: SuccessCodes.RestorePasswordEmailSentSuccessfully,
      message: i18n.t(DictionaryPathToken.RestorePasswordEmailWasSentSuccessfully),
      httpCode: HttpStatus.OK,
      details: {
        ...cognitoResult,
      },
    }
  }

  public async confirmRestorePasswordAdmin(restorePasswordBody: IConfirmRestorePasswordAdminBody) {
    const { email, code, newPassword, i18n } = restorePasswordBody

    const cognitoResult = await this.cognitoAdminService.confirmRestorePassword(email, code, newPassword)
    return {
      code: SuccessCodes.RestorePasswordConfirmedSuccessfully,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.PasswordWasRestoredSuccessfully),
      details: {
        ...cognitoResult,
      },
    }
  }

  private createUserAttr(userInfo: Record<string, unknown>): Array<IUserAttributes> {
    const userAttr = []
    for (const key in userInfo) {
      userAttr.push({ Name: key, Value: userInfo[key] })
    }

    return userAttr
  }

  private async isUsernameExist(email: string, username: string): Promise<Array<IIsUserExist>> {
    const results = await Promise.all([
      this.authAdminUserService.getUserByEmail(email),
      this.authAdminUserService.getUserByUsername(username),
    ])
    const resultsWithMethod = results.map((user, index) => ({
      method: index === 0 ? 'email' : 'username',
      user,
    }))
    return resultsWithMethod.filter((user) => user.user)
  }
}
