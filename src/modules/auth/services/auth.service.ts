import { CognitoErrorResponseCodes } from './../../../constants/integrations/cognito-error-codes'
import { ForbiddenError } from './../../../core/errors/forbidden.error'
import { DictionaryPathToken } from './../../../constants/dictionary.constants'
import { DictionaryErrorMessages } from '../../../constants/responses/messages.error.constants'
import { BadRequestError } from './../../../core/errors/bad-request.error'
import { UserEntity } from '../../../database/entities/user.entity'
import { IUserAttributes } from './../../../models/cognito.models'
import {
  IConfirmEmailBodyModel,
  IConfirmRestorePassword,
  IIsUserExist,
  ILogInBodyModel,
  ILogoutBodyModel,
  IRefreshResponse,
  IResendConfirmationBody,
  ISignInResponse,
  ISignUpBodyModel,
} from './../../../models/auth.models'
import { HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CognitoService } from '../../../integrations/cognito/services/cognito.service'
import { AWSError, CognitoIdentityServiceProvider } from 'aws-sdk'
import { AuthUserService } from './entity/user-entity.service'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { InternalServerError } from '../../../core/errors/internal-server.error'
import { IBaseResponse } from '../../../models/response.models'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { NotFoundError } from '../../../core/errors/not-found.error'
import { I18nContext } from 'nestjs-i18n'
import { UserSettingsNotificationsCrudService } from '../../api/user-settings-notifications/user-settings-notifications.crud'
import { UserSettingsEntityService } from '../../api/user-settings/services/entity/user-settings-entity.service'
import { UserTargetGroupsService } from '../../api/user-target-groups/user-target-groups.service'
import { MailchimpService } from '../../../integrations/mailchimp/mailchimp.service'
import { Environment } from '../../../constants/config.constants'
import { AudienceMemberStatus } from '../../../constants/enums/mailchimp.constants'
import { TargetGroup } from '../../../constants/enums/target-group.constants'
import { FailedLoginService } from './failed-login.service'
import { failedLoginAttemptsLimit } from '../../../constants/enums/admin/auth.constants'
import { AudienceMemberExistError } from '../../../integrations/mailchimp/errors/audience-member-exist.error'
import { RestorePasswordDTO } from '../auth.dto'
import { SesService } from '../../../integrations/ses/ses.service'
import { recoveryUsernameMailOptions } from '../../../constants/recovery-username.constants'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    protected cognitoService: CognitoService,
    protected configService: ConfigService,
    private authUserService: AuthUserService,
    private userSettingsNotificationsCrudService: UserSettingsNotificationsCrudService,
    private userSettingsCrudService: UserSettingsEntityService,
    private userTargetGroupsService: UserTargetGroupsService,
    private mailchimpService: MailchimpService,
    private failedLoginService: FailedLoginService,
    private sesService: SesService,
  ) {}

  public async signUp(body: ISignUpBodyModel): Promise<UserEntity | AWSError> {
    const { email, username, i18n } = body

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

    let isMailchimpMemberExists = false
    try {
      isMailchimpMemberExists = await this.mailchimpService.isAudienceMemberExist(
        this.configService.get(Environment.MailChimpDefaultAudienceId),
        email,
      )
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.MailchimpInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { ...e.originalError },
      )
    }

    if (isMailchimpMemberExists) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.MailchimpAudienceMemberExist),
        ErrorCodes.MailchimpInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    const userAttr = this.createUserAttr({
      email: email,
      nickname: username,
    })

    const cognitoResult = await this.cognitoService.signUp(body, userAttr)

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

    const user = await this.authUserService.saveUser({
      email,
      username,
      cognitoId: cognitoResult['UserSub'],
    })

    await this.userSettingsCrudService.createInitialSettings(user.id)
    await this.userSettingsNotificationsCrudService.createInititalNotifications(user.id)
    try {
      await this.mailchimpService.addAudienceMember(this.configService.get(Environment.MailChimpDefaultAudienceId), {
        email: user.email,
        status: AudienceMemberStatus.pending,
      })
    } catch (e) {
      throw new InternalServerError(
        e instanceof AudienceMemberExistError
          ? i18n.t(DictionaryPathToken.MailchimpAudienceMemberExist)
          : DictionaryErrorMessages.InternalServerError,
        ErrorCodes.MailchimpInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { ...e.originalError },
      )
    }

    return user
  }

  public async resendConfirmationEmail(body: IResendConfirmationBody): Promise<IBaseResponse | AWSError> {
    const { username, i18n } = body

    const cognitoResult = await this.cognitoService.resendConfirmationCode(username)

    return {
      code: SuccessCodes.EmailConfirmedSuccessfully,
      message: i18n.t(DictionaryPathToken.EmailConfirmedSuccessfully),
      httpCode: HttpStatus.OK,
      details: {
        ...cognitoResult,
      },
    }
  }

  public async confirmEmail(body: IConfirmEmailBodyModel): Promise<IBaseResponse | AWSError> {
    const { username, code, i18n } = body

    const cognitoResult = await this.cognitoService.confirmEmail(username, code)

    const user = await this.authUserService.getUserByUsername(username)
    await this.authUserService.confirmUserEmail(user)
    await this.mailchimpService.updateAudienceMember(
      this.configService.get(Environment.MailChimpDefaultAudienceId),
      user.email,
      {
        status: AudienceMemberStatus.subscribed,
      },
    )
    await this.userTargetGroupsService.assignTargetGroupByUserId(user.id, TargetGroup.All)

    return {
      code: SuccessCodes.EmailConfirmedSuccessfully,
      message: i18n.t(DictionaryPathToken.EmailConfirmedSuccessfully),
      httpCode: HttpStatus.OK,
      details: {
        ...cognitoResult,
      },
    }
  }

  public async login(body: ILogInBodyModel): Promise<ISignInResponse | AWSError> {
    const { username, password, i18n } = body

    const userByUsername = await this.authUserService.getUserByUsername(username)

    if (!userByUsername) {
      throw new NotFoundError(
        i18n.t(DictionaryPathToken.UserByUsernameNotFound),
        ErrorCodes.InvalidUserCredentials,
        HttpStatus.NOT_FOUND,
        {
          message: DictionaryErrorMessages.UsernameNotFound,
        },
      )
    }

    if (!userByUsername.isEmailConfirmed) {
      throw new ForbiddenError(
        body.i18n.t(DictionaryPathToken.UnconfiredEmailLoginFailed),
        ErrorCodes.EmailNotVerified,
        HttpStatus.FORBIDDEN,
      )
    }

    if (this.failedLoginService.isUserBlocked(userByUsername)) {
      if (this.failedLoginService.isBlockTimeOver(userByUsername.lastLoginAttemptAt)) {
        await this.authUserService.resetLoginFailedAttemptsCount(userByUsername)
      } else {
        throw new ForbiddenError(
          i18n.t(DictionaryPathToken.MobileUserTemporarilyBlockedFailedLoginAttempts),
          ErrorCodes.MobileUserTemporarilyBlocked,
          HttpStatus.FORBIDDEN,
        )
      }
    }

    let cognitoResult
    try {
      cognitoResult = await this.cognitoService.login(username, password)
    } catch (error) {
      if (error.code === CognitoErrorResponseCodes.UserNotConfirmed) {
        throw new BadRequestError(
          i18n.t(DictionaryPathToken.UserNotConfirmed),
          ErrorCodes.UserNotConfirmed,
          HttpStatus.BAD_REQUEST,
          {
            ...error,
          },
        )
      }

      if (
        error.code === CognitoErrorResponseCodes.NotAuthorized ||
        error.code === CognitoErrorResponseCodes.InvalidParameterException
      ) {
        if (this.failedLoginService.isLimitFailedLogin(userByUsername)) {
          await this.authUserService.updateLastLoginAttemptAt(userByUsername)
          this.logger.log(`User ${userByUsername.username} has ${failedLoginAttemptsLimit} failed attempts to login`)
          try {
            this.logger.log(`Notify user: ${userByUsername.username}`)
            await this.failedLoginService.notifyUserFailedLoginAttempts(userByUsername, i18n)
          } catch (e) {
            this.logger.error(`Got error: ${e}`)
          }
        }
        await this.authUserService.incrementLoginFailedAttempt(userByUsername)
        throw new BadRequestError(
          i18n.t(DictionaryPathToken.UserInvalidCredentials),
          ErrorCodes.InvalidUserCredentials,
          HttpStatus.BAD_REQUEST,
          {
            ...error,
          },
        )
      }

      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...error,
        },
      )
    }

    const { AccessToken, ExpiresIn, TokenType, RefreshToken, IdToken } = cognitoResult['AuthenticationResult']

    await this.authUserService.resetLoginFailedAttemptsCount(userByUsername)
    let cognitoUser
    if (AccessToken) {
      cognitoUser = await this.cognitoService.getUser(AccessToken)
    }

    this.logger.log(`User found in Cognito:`)
    this.logger.log(JSON.stringify(cognitoUser))

    this.logger.log('Cognito user attributes:')
    this.logger.log(JSON.stringify(cognitoUser['UserAttributes']))

    await this.authUserService.updateLastLoginAt(userByUsername)

    return {
      accessToken: AccessToken,
      expiresIn: ExpiresIn,
      tokenType: TokenType,
      refreshToken: RefreshToken,
      idToken: IdToken,
      user: userByUsername,
    }
  }

  public async refreshToken(refreshToken: string): Promise<IRefreshResponse> {
    const cognitoResult = await this.cognitoService.refresh(refreshToken)
    const { AccessToken, ExpiresIn, TokenType, IdToken } = cognitoResult['AuthenticationResult']

    try {
      const cognitoUser = (await this.cognitoService.getUser(
        AccessToken,
      )) as CognitoIdentityServiceProvider.Types.GetUserResponse
      const user = await this.authUserService.getUserByUsername(cognitoUser.Username)
      await this.authUserService.updateUserById(user.id, { lastLoginAt: new Date() })
    } catch (e) {
      this.logger.error('Something went wrong during the refresh token')
      this.logger.error(e.toString())
    }

    return {
      idToken: IdToken,
      accessToken: AccessToken,
      expiresIn: ExpiresIn,
      tokenType: TokenType,
    }
  }

  public async restorePassword(email: string, i18n: I18nContext): Promise<IBaseResponse> {
    const username = await this.getUsernameViaEmail(email)

    this.logger.log(`Founded username by email: ${username}`)

    const cognitoResult = await this.cognitoService.restorePassword(username)
    return {
      code: SuccessCodes.RestorePasswordEmailSentSuccessfully,
      message: i18n.t(DictionaryPathToken.RestorePasswordEmailWasSentSuccessfully),
      httpCode: HttpStatus.OK,
      details: {
        ...cognitoResult,
      },
    }
  }

  public async restoreUsername(params: RestorePasswordDTO, i18n: I18nContext): Promise<IBaseResponse> {
    const { email } = params

    const user = await this.authUserService.getUserByEmail(email)

    if (user) {
      const { username } = user

      const mailOptions = recoveryUsernameMailOptions(username)

      await this.sesService.sendEmail({
        to: email,
        subject: mailOptions.subject,
        message: mailOptions.body,
      })
    }

    return {
      code: SuccessCodes.RestoreUsernameExecuteSuccessfully,
      message: i18n.t(DictionaryPathToken.RestoreUsernameExecutedSuccessfully),
      httpCode: HttpStatus.OK,
      details: {},
    }
  }

  public async confirmRestorePassword(body: IConfirmRestorePassword): Promise<IBaseResponse> {
    const { email, code, newPassword, i18n } = body

    const username = await this.getUsernameViaEmail(email)

    let cognitoResult

    try {
      cognitoResult = await this.cognitoService.confirmRestorePassword(username, code, newPassword)
    } catch (e) {
      if (e.code === CognitoErrorResponseCodes.ExpiredCodeException) {
        throw new BadRequestError(
          body.i18n.t(DictionaryPathToken.LinkExpired),
          ErrorCodes.LinkExpired,
          HttpStatus.BAD_REQUEST,
          { ...e },
        )
      }

      if (e.code === CognitoErrorResponseCodes.LimitExceededException) {
        throw new BadRequestError(
          body.i18n.t(DictionaryPathToken.AttemptLimit),
          ErrorCodes.AttemptLimitExceeded,
          HttpStatus.BAD_REQUEST,
          { ...e },
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

    return {
      code: SuccessCodes.RestorePasswordConfirmedSuccessfully,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.PasswordWasRestoredSuccessfully),
      details: {
        ...cognitoResult,
      },
    }
  }

  public async logout(logoutBody: ILogoutBodyModel): Promise<IBaseResponse> {
    const { accessToken, i18n } = logoutBody

    await this.cognitoService.logout(accessToken)
    return {
      httpCode: HttpStatus.OK,
      code: SuccessCodes.RefreshTokenRevokedSuccessfully,
      message: i18n.t(DictionaryPathToken.SignoutSuccessfully),
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
      this.authUserService.getUserByEmail(email),
      this.authUserService.getUserByUsername(username),
    ])

    const resultsWithMethod = results.map((user, index) => ({
      method: index === 0 ? 'email' : 'username',
      user,
    }))

    return resultsWithMethod.filter((user) => user.user)
  }

  private async getUsernameViaEmail(email: string): Promise<string> {
    const userByEmail = await this.authUserService.getUserByEmail(email)
    if (!userByEmail) {
      throw new NotFoundError(
        DictionaryErrorMessages.UserWithEmailNotFound,
        ErrorCodes.UserByEmailNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    const { username } = userByEmail
    return username
  }
}
