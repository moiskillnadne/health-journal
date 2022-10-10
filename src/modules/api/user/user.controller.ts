import { BaseSuccessResponse } from './../../../core/dtos/response/base-success.dto'
import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { ProfilePhotoEntity } from '../../../database/entities/profile-photo.entity'
import { IBaseResponse } from '../../../models/response.models'

import { UserService } from './user.service'

import { ProfileImageSaveDTO } from './dto/profile-image.dto'
import { GerProfileImageResponseDto, GetUserInfoResponseDto } from './dto/user.response.dto'
import {
  ChangePasswordDTO,
  PostResendVerificationCodeParamsDto,
  ReferralDTO,
  UpdateUserDetailsDTO,
  VerifyUpdateEmailDTO,
} from './dto/user.dto'

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @ApiResponse({ status: 200, type: GetUserInfoResponseDto })
  public getUserInfoById(@Req() { user }) {
    return this.userService.getUserInfoById(user.id)
  }

  @Put('save')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public async saveUserDetails(
    @Body() userDetailsBody: UpdateUserDetailsDTO,
    @Req() req,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const { data, accessToken } = userDetailsBody
    const { firstName, lastName, companyCode, country, state, city } = data

    let actualUserEmail = req.user.email
    if (req.user.email !== data.email && accessToken) {
      await this.userService.updateEmail(req.user, { email: data.email, accessToken }, i18n)
      actualUserEmail = data.email
    }

    return this.userService.updateUserDetails(
      req.user,
      actualUserEmail,
      { firstName, lastName, companyCode, country, state, city },
      i18n,
    )
  }

  @Post('referral')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public addReferral(@Req() req, @Body() referralBody: ReferralDTO, @I18n() i18n: I18nContext): Promise<IBaseResponse> {
    const { referralType, referralValue } = referralBody

    return this.userService.addReferralToUser(req.user.id, { type: referralType, value: referralValue }, i18n)
  }

  @Put('profile-image/upload')
  @ApiOkResponse({ type: GerProfileImageResponseDto })
  public async uploadProfileImage(
    @Body() body: ProfileImageSaveDTO,
    @Req() req,
    @I18n() i18n: I18nContext,
  ): Promise<ProfilePhotoEntity> {
    return this.userService.saveProfileImage(body, req.user.id, i18n)
  }

  @Get('profile-image')
  @ApiOkResponse({ type: GerProfileImageResponseDto })
  public getProfileImageByUserId(@Req() req): Promise<ProfilePhotoEntity> {
    return this.userService.getProfileImageByUserId(req.user.id)
  }

  @Post('resend-verification-code')
  public resendUserAttributeVerificationCode(
    @Body() body: PostResendVerificationCodeParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userService.resendUserAttributeVerificationCode(body, i18n)
  }

  @Post('verify/change-email')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public verifyUpdatedEmail(
    @Req() req,
    @Body() verifyEmailBody: VerifyUpdateEmailDTO,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.userService.verifyUpdatedEmail(req.user, verifyEmailBody, i18n)
  }

  @Post('change-password')
  @ApiOkResponse({ type: BaseSuccessResponse })
  public changePassword(@Body() body: ChangePasswordDTO, @I18n() i18n: I18nContext): Promise<IBaseResponse> {
    return this.userService.changePassword(body, i18n)
  }
}
