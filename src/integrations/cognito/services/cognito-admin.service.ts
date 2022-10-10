import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AWSError, CognitoIdentityServiceProvider, Credentials } from 'aws-sdk'
import { Environment } from '../../../constants/config.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { DictionaryErrorMessages } from '../../../constants/responses/messages.error.constants'
import { InternalServerError } from '../../../core/errors/internal-server.error'
import { CryptService } from '../../../core/services/crypt.service'
import { IUserInfo } from '../../../models/cognito.models'

@Injectable()
export class CognitoAdminService extends CryptService {
  private config: CognitoIdentityServiceProvider.Types.ClientConfiguration = {
    region: this.configService.get(Environment.CognitoRegion),
    credentials: new Credentials(
      this.configService.get(Environment.AwsAccessKey),
      this.configService.get(Environment.AwsSecretAccesskey),
    ),
  }

  private clientId = this.configService.get(Environment.CognitoClientIdAdmin)

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
    const { password, email } = userInfo

    const params: CognitoIdentityServiceProvider.SignUpRequest = {
      ClientId: this.clientId,
      Password: password,
      Username: email,
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

  async restorePassword(email: string): Promise<CognitoIdentityServiceProvider.ForgotPasswordResponse | AWSError> {
    const params = {
      ClientId: this.clientId,
      Username: email,
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
    email: string,
    code: string,
    newPassword: string,
  ): Promise<CognitoIdentityServiceProvider.ConfirmForgotPasswordResponse | AWSError> {
    const params = {
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    }

    try {
      const result = await this.cognitoIdentity.confirmForgotPassword(params).promise()
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
