import { IntersectionType, OmitType } from '@nestjs/swagger'

import { ProfilePhotoEntity } from '../../../../database/entities/profile-photo.entity'

import { UserProfileDto, UserLocationDto } from './user.dto'

export class GerProfileImageResponseDto extends OmitType(ProfilePhotoEntity, ['user'] as const) {}

export class GetUserImageResponseDto {
  image: GerProfileImageResponseDto
}

export class GetUserProfileResponseDto extends IntersectionType(UserProfileDto, UserLocationDto) {}

export class GetUserInfoResponseDto extends IntersectionType(GetUserProfileResponseDto, GetUserImageResponseDto) {}
