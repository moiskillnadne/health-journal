import { IUserInfo } from './../../../models/cognito.models'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AWSError, CognitoIdentityServiceProvider, Credentials } from 'aws-sdk'
import { Environment } from '../../../constants/config.constants'
import { CryptService } from '../../../core/services/crypt.service'
import { InternalServerError } from '../../../core/errors/internal-server.error'
import { DictionaryErrorMessages } from '../../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { ChangePasswordDTO } from '../../../modules/api/user/dto/user.dto'

@Injectable()
export class CognitoService extends CryptService {
  private config: CognitoIdentityServiceProvider.Types.ClientConfiguration = {
    region: this.configService.get(Environment.CognitoRegion),
    credentials: new Credentials(
      this.configService.get(Environment.AwsAccessKey),
      this.configService.get(Environment.AwsSecretAccesskey),
    ),
  }

  private clientId = this.configService.get(Environment.CognitoClientId)
  private authFlow = 'USER_PASSWORD_AUTH'
  private refreshFlow = 'REFRESH_TOKEN_AUTH'

  cognitoIdentity: CognitoIdentityServiceProvider

  constructor(protected configService: ConfigService) {
    super(configService)
    this.cognitoIdentity = new CognitoIdentityServiceProvider(this.config)
  }

  async signUp(
    userInfo: IUserInfo,
    userAttr: CognitoIdentityServiceProvider.AttributeListType,
  ): Promise<CognitoIdentityServiceProvider.SignUpResponse | AWSError> {
    const { password, username } = userInfo

    const params: CognitoIdentityServiceProvider.SignUpRequest = {
      ClientId: this.clientId,
      Password: password,
      Username: username,
      UserAttributes: userAttr,
    }

    try {
      const result = await this.cognitoIdentity.signUp(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async resendConfirmationCode(
    username: string,
  ): Promise<CognitoIdentityServiceProvider.Types.ResendConfirmationCodeResponse | AWSError> {
    const params: CognitoIdentityServiceProvider.Types.ResendConfirmationCodeRequest = {
      ClientId: this.clientId,
      Username: username,
    }

    try {
      const result = await this.cognitoIdentity.resendConfirmationCode(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async confirmEmail(
    username: string,
    code: string,
  ): Promise<CognitoIdentityServiceProvider.ConfirmSignUpResponse | AWSError> {
    const params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      Username: username,
    }

    try {
      const result = await this.cognitoIdentity.confirmSignUp(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async login(
    username: string,
    password: string,
  ): Promise<CognitoIdentityServiceProvider.InitiateAuthResponse | AWSError> {
    const params = {
      AuthFlow: this.authFlow,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    }

    try {
      const result = await this.cognitoIdentity.initiateAuth(params).promise()
      return result
    } catch (e) {
      throw e
    }
  }

  async refresh(refreshToken: string): Promise<CognitoIdentityServiceProvider.InitiateAuthResponse | AWSError> {
    const params = {
      AuthFlow: this.refreshFlow,
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    }

    try {
      const result = await this.cognitoIdentity.initiateAuth(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async restorePassword(username: string): Promise<CognitoIdentityServiceProvider.ForgotPasswordResponse | AWSError> {
    const params = {
      ClientId: this.clientId,
      Username: username,
    }

    try {
      const result = await this.cognitoIdentity.forgotPassword(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async confirmRestorePassword(
    username: string,
    code: string,
    newPassword: string,
  ): Promise<CognitoIdentityServiceProvider.ConfirmForgotPasswordResponse | AWSError> {
    const params = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: code,
      Password: newPassword,
    }

    try {
      const result = await this.cognitoIdentity.confirmForgotPassword(params).promise()
      return result
    } catch (e) {
      throw e
    }
  }

  async logout(token: string): Promise<CognitoIdentityServiceProvider.Types.GlobalSignOutResponse | AWSError> {
    const params = {
      AccessToken: token,
    }

    try {
      const result = await this.cognitoIdentity.globalSignOut(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async updateUserEmail(
    accessToken: string,
    userAttr: CognitoIdentityServiceProvider.AttributeListType,
  ): Promise<CognitoIdentityServiceProvider.Types.UpdateUserAttributesResponse | AWSError> {
    const params: CognitoIdentityServiceProvider.Types.UpdateUserAttributesRequest = {
      AccessToken: accessToken,
      UserAttributes: userAttr,
    }

    try {
      const result = await this.cognitoIdentity.updateUserAttributes(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async confirmUpdatedUserAttributes(accessToken: string, attrName: string, code: string) {
    const params: CognitoIdentityServiceProvider.Types.VerifyUserAttributeRequest = {
      AccessToken: accessToken,
      AttributeName: attrName,
      Code: code,
    }

    try {
      const result = await this.cognitoIdentity.verifyUserAttribute(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async changePassword(
    passDetails: ChangePasswordDTO,
  ): Promise<CognitoIdentityServiceProvider.Types.ChangePasswordResponse | AWSError> {
    const params: CognitoIdentityServiceProvider.Types.ChangePasswordRequest = {
      AccessToken: passDetails.accessToken,
      PreviousPassword: passDetails.prevPassword,
      ProposedPassword: passDetails.proposedPassword,
    }

    try {
      const result = await this.cognitoIdentity.changePassword(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async getUser(AccessToken: string): Promise<CognitoIdentityServiceProvider.Types.GetUserResponse | AWSError> {
    const params: CognitoIdentityServiceProvider.Types.GetUserRequest = { AccessToken }

    try {
      const cognitoUser = await this.cognitoIdentity.getUser(params).promise()
      return cognitoUser
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }

  async getAttributeVerificationCode(AccessToken: string, AttributeName: string) {
    const params: CognitoIdentityServiceProvider.Types.GetUserAttributeVerificationCodeRequest = {
      AccessToken,
      AttributeName,
    }

    try {
      const result = await this.cognitoIdentity.getUserAttributeVerificationCode(params).promise()
      return result
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }
  }
}
