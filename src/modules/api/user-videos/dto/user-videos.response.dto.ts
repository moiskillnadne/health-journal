import { PickType, IntersectionType } from '@nestjs/swagger'

import { UserVideosEntity } from '../../../../database/entities/user-videos.entity'

export class UserFavoriteVideoDto {
  title: string
  preview: string
}

export class GetUserFavoriteVideosResponseDto extends IntersectionType(
  UserFavoriteVideoDto,
  PickType(UserVideosEntity, ['id', 'isViewed', 'isVisited'] as const),
) {}
