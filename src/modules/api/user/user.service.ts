import { CognitoErrorResponseCodes } from './../../../constants/integrations/cognito-error-codes'
import { HttpStatus, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { v4 as uuid } from 'uuid'

import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { InternalServerError } from '../../../core/errors/internal-server.error'
import { IBaseResponse } from '../../../models/response.models'

import { UserCrudService } from './user.crud'
import { IUpdateEmailDeails, IVerifyEmail } from '../../../models/account-details.models'
import { IUserAttributes } from '../../../models/cognito.models'
import { CognitoService } from '../../../integrations/cognito/services/cognito.service'
import { BadRequestError } from '../../../core/errors/bad-request.error'
import { ProfilePhotoImageFormats } from '../../../constants/enums/storage.constants'
import { ConfigService } from '@nestjs/config'
import { ProfileImageCrud } from './profile-image.crud'
import { ProfilePhotoEntity } from '../../../database/entities/profile-photo.entity'
import { ReferralEntityService } from './referral-entity.service'
import { IReferralModel } from '../../../models/referral.models'

import { ProfileImageSaveDTO } from './dto/profile-image.dto'
import { ChangePasswordDTO, PostResendVerificationCodeParamsDto, UserDetailsParamsDto } from './dto/user.dto'
import { GetUserInfoResponseDto } from './dto/user.response.dto'
import { MailchimpService } from '../../../integrations/mailchimp/mailchimp.service'
import { Environment } from '../../../constants/config.constants'
import { AudienceMemberStatus } from '../../../constants/enums/mailchimp.constants'
import { AudienceMemberExistError } from '../../../integrations/mailchimp/errors/audience-member-exist.error'
import { DictionaryErrorMessages } from '../../../constants/responses/messages.error.constants'

@Injectable()
export class UserService {
  constructor(
    private userBaseService: UserCrudService,
    private cognitoService: CognitoService,
    private configService: ConfigService,
    private profileImageCrud: ProfileImageCrud,
    private referralService: ReferralEntityService,
    private mailchimpService: MailchimpService,
  ) {}

  public async updateUserDetails(
    user,
    actualUserEmail: string,
    userDetails: UserDetailsParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    try {
      await this.userBaseService.updateUserById(user.id, userDetails)
    } catch (e) {
      throw new InternalServerError(i18n.t(DictionaryPathToken.UpdatedFailed), ErrorCodes.InternalServerError)
    }

    if (
      (userDetails.firstName !== undefined && userDetails.firstName !== user.firstName) ||
      (userDetails.lastName !== undefined && userDetails.lastName !== user.lastName)
    ) {
      try {
        await this.mailchimpService.updateAudienceMember(
          this.configService.get(Environment.MailChimpDefaultAudienceId),
          actualUserEmail,
          {
            ...(userDetails.firstName !== user.firstName ? { firstName: userDetails.firstName } : {}),
            ...(userDetails.lastName !== user.lastName ? { lastName: userDetails.lastName } : {}),
          },
        )
      } catch (e) {
        throw new InternalServerError(
          DictionaryErrorMessages.InternalServerError,
          ErrorCodes.MailchimpInternalError,
          HttpStatus.INTERNAL_SERVER_ERROR,
          { ...e.originalError },
        )
      }
    }

    return {
      code: SuccessCodes.AccountDetailsUpdated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
    }
  }

  public async updateEmail(user, updateEmailDetails: IUpdateEmailDeails, i18n: I18nContext): Promise<IBaseResponse> {
    const { email, accessToken } = updateEmailDetails
    const oldUserEmail = user.email
    const duplicateEmailUser = await this.isEmailAlreadyExist(email)
    if (duplicateEmailUser) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserByEmailExist),
        ErrorCodes.UserAlreadyExist,
        HttpStatus.BAD_REQUEST,
      )
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

    const attr = this.createUserAttr({ email })

    try {
      await this.cognitoService.updateUserEmail(accessToken, attr)
    } catch (e) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.UpdatedFailed),
        ErrorCodes.AwsInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          ...e,
        },
      )
    }

    try {
      await this.userBaseService.updateUserById(user.id, { email, isEmailConfirmed: false })
    } catch (e) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.UpdatedFailed),
        ErrorCodes.InternalServerError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { ...e },
      )
    }

    try {
      await this.mailchimpService.updateAudienceMember(
        this.configService.get(Environment.MailChimpDefaultAudienceId),
        oldUserEmail,
        {
          email,
          status: AudienceMemberStatus.pending,
        },
      )
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

    return {
      code: SuccessCodes.AccountDetailsUpdated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
    }
  }

  public async saveProfileImage(
    file: ProfileImageSaveDTO,
    userId: string,
    i18n: I18nContext,
  ): Promise<ProfilePhotoEntity> {
    try {
      return this.profileImageCrud.saveProfileImage(file, userId)
    } catch (error) {
      throw new InternalServerError(
        i18n.t(DictionaryPathToken.InternalServerError),
        ErrorCodes.InternalServerError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      )
    }
  }

  public async getProfileImageByUserId(userId: string): Promise<ProfilePhotoEntity> {
    return this.profileImageCrud.getProfileImageByUserId(userId)
  }

  public async getUserInfoById(userId: string): Promise<GetUserInfoResponseDto> {
    const user = await this.userBaseService.getUserInfoById(userId)
    const image = await this.profileImageCrud.getProfileImageByUserId(userId)

    return {
      ...user,
      image,
    }
  }

  public async verifyUpdatedEmail(user, verifyEmailBody: IVerifyEmail, i18n: I18nContext): Promise<IBaseResponse> {
    const { accessToken, code } = verifyEmailBody

    try {
      await this.cognitoService.confirmUpdatedUserAttributes(accessToken, 'email', code)
    } catch (error) {
      throw new BadRequestError(i18n.t(DictionaryPathToken.LinkExpired), ErrorCodes.LinkExpired, HttpStatus.BAD_REQUEST)
    }

    try {
      await this.mailchimpService.updateAudienceMember(
        this.configService.get(Environment.MailChimpDefaultAudienceId),
        user.email,
        {
          status: AudienceMemberStatus.subscribed,
        },
      )
    } catch (e) {
      throw new InternalServerError(
        DictionaryErrorMessages.InternalServerError,
        ErrorCodes.MailchimpInternalError,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { ...e.originalError },
      )
    }
    await this.userBaseService.confirmUserEmail(user)

    return {
      code: SuccessCodes.EmailConfirmedSuccessfully,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedEmailConfirmed),
    }
  }

  public async resendUserAttributeVerificationCode(params: PostResendVerificationCodeParamsDto, i18n: I18nContext) {
    await this.cognitoService.getAttributeVerificationCode(params.accessCode, params.attribute)

    return {
      code: SuccessCodes.EmailSent,
      message: i18n.t(DictionaryPathToken.EmailSent),
      httpCode: HttpStatus.OK,
    }
  }

  public async changePassword(changePasswordDetails: ChangePasswordDTO, i18n: I18nContext): Promise<IBaseResponse> {
    try {
      await this.cognitoService.changePassword(changePasswordDetails)
    } catch (e) {
      if (e.details.code === CognitoErrorResponseCodes.NotAuthorized) {
        throw new BadRequestError(
          i18n.t(DictionaryPathToken.CurrentPasswordIncorrect),
          ErrorCodes.CurrentPasswordIncorrect,
          HttpStatus.BAD_REQUEST,
          { ...e },
        )
      }

      throw e
    }

    return {
      code: SuccessCodes.PasswordChanged,
      message: i18n.t(DictionaryPathToken.PasswordChanged),
      httpCode: HttpStatus.OK,
    }
  }

  public async addReferralToUser(id: string, referral: IReferralModel, i18n: I18nContext): Promise<IBaseResponse> {
    const user = await this.userBaseService.getUserById(id)
    if (!user) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.UserByIdNotFound),
        ErrorCodes.UserByIdNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    const { value, type } = referral
    const referralResult = await this.referralService.saveReferral({ value, type })

    await this.userBaseService.updateUserById(id, { referral: referralResult, isQuestionnairePassed: true })

    return {
      message: i18n.t(DictionaryPathToken.RefferalAddedSuccessfully),
      httpCode: HttpStatus.OK,
      code: SuccessCodes.ReferralAddedSuccessfully,
    }
  }

  private createUserAttr(userInfo: Record<string, unknown>): Array<IUserAttributes> {
    const userAttr = []
    for (const key in userInfo) {
      userAttr.push({ Name: key, Value: userInfo[key] })
    }

    return userAttr
  }

  private async isEmailAlreadyExist(email: string) {
    const user = await this.userBaseService.getUserByEmail(email)

    return user
  }

  private generateUniqFileKey(destination: string, fileExt: ProfilePhotoImageFormats): string {
    return `${destination}/${uuid()}.${fileExt}`
  }
}
