import { BaseSuccessResponse } from './../../core/dtos/response/base-success.dto'
import { DictionaryPathToken } from './../../constants/dictionary.constants'
import { BadRequestError } from './../../core/errors/bad-request.error'
import { UserEntity } from '../../database/entities/user.entity'
import {
  ConfirmEmailDTO,
  ConfirmRestorePasswordDTO,
  LogInDTO,
  LogoutDTO,
  ResendConfirmationCodeDTO,
  RestorePasswordDTO,
  SignUpBodyDTO,
  UserResponse,
} from './auth.dto'
import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './services/auth.service'
import { AWSError } from 'aws-sdk'
import { Public } from '../../core/decorators/public-route.decorator'
import { ErrorCodes } from '../../constants/responses/codes.error.constants'
import { IBaseResponse } from '../../models/response.models'
import { IRefreshResponse, ISignInResponse } from '../../models/auth.models'
import { I18n, I18nContext } from 'nestjs-i18n'
import { LoginResponseDto, RefreshResponseDto } from './auth-response.dto'

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, type: UserResponse })
  public async signUp(@Body() signUpBody: SignUpBodyDTO, @I18n() i18n: I18nContext): Promise<UserEntity | AWSError> {
    return this.authService.signUp({ ...signUpBody, i18n }).catch((error) => {
      throw error
    })
  }

  @Post('resend-confirmation-code')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public async resendConfiramtionCode(
    @Body() resendConfirmationCodeBody: ResendConfirmationCodeDTO,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse | AWSError> {
    return this.authService.resendConfirmationEmail({ ...resendConfirmationCodeBody, i18n })
  }

  @Post('confirm-email')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public confirmEmail(
    @Body() confirmEmailBody: ConfirmEmailDTO,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse | AWSError> {
    return this.authService.confirmEmail({ ...confirmEmailBody, i18n }).catch((e) => {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.CodeInvalid),
        ErrorCodes.InvalidConfirmCode,
        HttpStatus.BAD_REQUEST,
        {
          ...e,
        },
      )
    })
  }

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  public logIn(@Body() logInBody: LogInDTO, @I18n() i18n: I18nContext): Promise<ISignInResponse | AWSError> {
    return this.authService.login({ ...logInBody, i18n })
  }

  @Post('refresh')
  @ApiOkResponse({ type: RefreshResponseDto })
  public refreshToken(@Body() refreshBody): Promise<IRefreshResponse> {
    return this.authService.refreshToken(refreshBody.refreshToken)
  }

  @Post('restore-password')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public async restorePassword(
    @Body() restoreBody: RestorePasswordDTO,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const { email } = restoreBody

    return this.authService.restorePassword(email, i18n)
  }

  @Post('restore-username')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public async restoreUsername(@Body() params: RestorePasswordDTO, @I18n() i18n: I18nContext): Promise<IBaseResponse> {
    return this.authService.restoreUsername(params, i18n)
  }

  @Post('confirm-restore-password')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public async confirmRestorePassword(
    @Body() confirmRestorBody: ConfirmRestorePasswordDTO,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.authService.confirmRestorePassword({ ...confirmRestorBody, i18n })
  }

  @Post('logout')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public async logout(@Body() logoutBody: LogoutDTO, @I18n() i18n: I18nContext): Promise<IBaseResponse> {
    return this.authService.logout({ ...logoutBody, i18n })
  }
}
