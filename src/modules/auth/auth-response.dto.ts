import { UserEntity } from './../../database/entities/user.entity'
import { OmitType } from '@nestjs/swagger'

export class UserAuthResponseDto extends OmitType(UserEntity, [
  'createAt',
  'referral',
  'card',
  'conditions',
  'gender',
  'race',
  'procedures',
  'medications',
  'journeySurvey',
  'lifestyleSurvey',
  'reminders',
  'additionalInformation',
] as const) {}

export class AuthTokensResponseDto {
  accessToken: string
  expiresIn: number
  tokenType: string
  refreshToken: string
  idToken: string
}

export class LoginResponseDto extends AuthTokensResponseDto {
  user: UserAuthResponseDto
}

export class RefreshResponseDto extends OmitType(AuthTokensResponseDto, ['refreshToken'] as const) {}
