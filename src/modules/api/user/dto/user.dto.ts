import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsDate, IsString, IsOptional, IsEnum, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { messageWrapper } from '../../../../core/helpers/class-validation'
import { IsPasswordCustom } from '../../../../core/decorators/password.decorators'
import { ReferralType } from '../../../../models/referral.models'

import { CITY_MAX_LENGTH, STATE_MAX_LENGTH, COUNTRY_MAX_LENGTH } from '../../../../constants/enums/region.constants'
import { userCompanyCodeMaxLen } from '../../../../constants/enums/user.constants'

export class UserParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  public username: string

  @IsNotEmpty()
  @IsString()
  public cognitoId: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsEmail({}, messageWrapper(DictionaryPathToken.InvalidFormat))
  public email: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.FirstNameIsString))
  public firstName: string

  @IsString(messageWrapper(DictionaryPathToken.LastNameIsString))
  public lastName: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  @MaxLength(userCompanyCodeMaxLen)
  public companyCode: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsDate(messageWrapper(DictionaryPathToken.InvalidFormat))
  @Type(() => Date)
  public dateOfBirth: Date

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  public genderId: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  public raceId: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  @MaxLength(CITY_MAX_LENGTH, messageWrapper(DictionaryPathToken.InvalidFormat))
  public city: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  @MaxLength(STATE_MAX_LENGTH, messageWrapper(DictionaryPathToken.InvalidFormat))
  public state: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.InvalidFormat))
  @MaxLength(COUNTRY_MAX_LENGTH, messageWrapper(DictionaryPathToken.InvalidFormat))
  public country: string
}

export class UserOptionalParamsDto extends PartialType(UserParamsDto) {}

export class UserPersonalParamsDto extends IntersectionType(
  PickType(UserOptionalParamsDto, ['lastName', 'companyCode'] as const),
  OmitType(UserParamsDto, ['username', 'lastName', 'cognitoId', 'email'] as const),
) {}

export class UserDetailsParamsDto extends OmitType(UserOptionalParamsDto, [
  'username',
  'cognitoId',
  'dateOfBirth',
  'genderId',
  'raceId',
] as const) {}

export class UpdateUserDetailsDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  public data: UserDetailsParamsDto

  @IsOptional()
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  public accessToken: string
}

export class VerifyUpdateEmailDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  public code: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  public accessToken: string
}

export class UserAuthParamsDto extends PickType(UserParamsDto, ['email', 'username', 'cognitoId'] as const) {}

export class UserProfileDto extends PickType(UserParamsDto, ['firstName', 'lastName', 'dateOfBirth'] as const) {}

export class UserLocationDto {
  country: string
  state: string
  city: string
}

export class ChangePasswordDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  public accessToken: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  public prevPassword: string

  @IsPasswordCustom()
  public proposedPassword: string
}

export class ReferralDTO {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsEnum(ReferralType, messageWrapper(DictionaryPathToken.InvalidFormat))
  referralType!: ReferralType

  @IsOptional()
  referralValue?: string
}

export class PostResendVerificationCodeParamsDto {
  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.IsString))
  attribute: string

  @IsNotEmpty(messageWrapper(DictionaryPathToken.IsNotEmpty))
  @IsString(messageWrapper(DictionaryPathToken.IsString))
  accessCode: string
}
