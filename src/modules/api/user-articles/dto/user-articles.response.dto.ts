import { PickType, IntersectionType } from '@nestjs/swagger'

import { UserArticlesEntity } from '../../../../database/entities/user-articles.entity'

export class UserFavoriteArticleDto {
  title: string
  preview: string
}

export class GetUserFavoriteArticlesResponseDto extends IntersectionType(
  UserFavoriteArticleDto,
  PickType(UserArticlesEntity, ['id', 'isVisited'] as const),
) {}
