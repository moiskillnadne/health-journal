import { BaseSuccessResponse } from './../../core/dtos/response/base-success.dto'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AWSError } from 'aws-sdk'
import { I18n, I18nContext } from 'nestjs-i18n'
import { Public } from '../../core/decorators/public-route.decorator'
import { ISignInAdminResponse } from '../../models/auth-admin.models'
import { IRefreshResponse } from '../../models/auth.models'
import { IBaseResponse } from '../../models/response.models'
import { IUserModelResponse } from '../../models/user.models'
import { RefreshResponseDto } from '../auth/auth-response.dto'
import {
  AdminConfirmRestorePasswordDTO,
  AdminLoginDTO,
  AdminRefreshDTO,
  AdminRestoreDTO,
  AdminSignupDTO,
} from './admin-auth.dto'
import { PostAdminUserLoginResponse, PostAdminUserSignUpResponse } from './dto/admin-user-auth-response.dto'
import { AuthAdminService } from './services/admin-auth.service'

@ApiTags('admin-auth')
@Public()
@Controller('/web-admin/auth')
export class AdminAuthController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @Post('signup')
  @ApiOkResponse({ type: PostAdminUserSignUpResponse })
  public signUpAdmin(
    @Body() signUp: AdminSignupDTO,
    @I18n() i18n: I18nContext,
  ): Promise<IUserModelResponse | AWSError> {
    return this.authAdminService.signUp({ ...signUp, i18n })
  }

  @Post('login')
  @ApiOkResponse({ type: PostAdminUserLoginResponse })
  public loginAdmin(
    @Body() loginBody: AdminLoginDTO,
    @I18n() i18n: I18nContext,
  ): Promise<ISignInAdminResponse | AWSError> {
    return this.authAdminService.loginAdmin({ ...loginBody, i18n })
  }

  @Post('refresh')
  @ApiOkResponse({ type: RefreshResponseDto })
  public refreshAdmin(@Body() refreshBody: AdminRefreshDTO): Promise<IRefreshResponse> {
    return this.authAdminService.refreshTokenAdmin(refreshBody)
  }

  @Post('restore-password')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public restorePassword(@Body() restoreBody: AdminRestoreDTO, @I18n() i18n: I18nContext): Promise<IBaseResponse> {
    const { email } = restoreBody

    return this.authAdminService.restorePasswordAdmin(email, i18n)
  }

  @Post('confirm-restore-password')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public confirmRestorePassword(
    @Body() confirmRestoreBody: AdminConfirmRestorePasswordDTO,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.authAdminService.confirmRestorePasswordAdmin({ ...confirmRestoreBody, i18n })
  }
}
