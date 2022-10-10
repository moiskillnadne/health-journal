import { PickType, IntersectionType } from '@nestjs/swagger'

import { UserRecipesEntity } from '../../../../database/entities/user-recipes.entity'

export class UserFavoriteRecipeDto {
  title: string
  preview: string
}

export class GetUserFavoriteRecipesResponseDto extends IntersectionType(
  UserFavoriteRecipeDto,
  PickType(UserRecipesEntity, ['id', 'isVisited'] as const),
) {}
