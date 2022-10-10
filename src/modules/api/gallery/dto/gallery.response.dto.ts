import { IntersectionType, PartialType, PickType } from '@nestjs/swagger'

import { StorageEntity } from '../../../../database/entities/storage.entity'
import { GalleryArticleEntity } from '../../../../database/entities/gallery-article.entity'
import { GalleryRecipeEntity } from '../../../../database/entities/gallery-recipe.entity'
import { GalleryVideoEntity } from '../../../../database/entities/gallery-video.entity'

export class GalleryVideoListResponseDTO extends PartialType(GalleryVideoEntity) {
  sourceUrl: string
  title?: string
  description?: string
  keywords?: string[]
  isFavorite?: boolean
  isVisited?: boolean
  isViewed?: boolean
}

export class GalleryLocalizedResponseDTO {
  sourceUrl: string
  title?: string
  summary?: string
  keywords?: string[]
  text?: string
  isFavorite?: boolean
  isVisited?: boolean
  type?: string
  isArticle?: boolean
}

export class GalleryArticleResponseDTO extends IntersectionType(
  GalleryArticleEntity,
  PickType(StorageEntity, ['bucketKey', 'bucketName'] as const),
) {
  public isArticle: boolean
}

export class GalleryRecipeResponseDTO extends IntersectionType(
  GalleryRecipeEntity,
  PickType(StorageEntity, ['bucketKey', 'bucketName'] as const),
) {
  public isArticle: boolean
}

export class GalleryArticleLocalizedResponseDTO extends IntersectionType(
  GalleryLocalizedResponseDTO,
  PickType(GalleryArticleEntity, ['id', 'createAt'] as const),
) {}

export class GalleryRecipeLocalizedResponseDTO extends IntersectionType(
  GalleryLocalizedResponseDTO,
  PickType(GalleryRecipeEntity, ['id', 'createAt'] as const),
) {}

export class GallerySingleVideoResponseDTO extends PickType(GalleryVideoListResponseDTO, [
  'id',
  'createAt',
  'title',
  'description',
  'isFavorite',
  'isVisited',
  'isViewed',
  'sourceUrl',
] as const) {}

export class GallerySingleArticleResponseDTO extends PickType(GalleryArticleLocalizedResponseDTO, [
  'id',
  'createAt',
  'isFavorite',
  'isVisited',
  'title',
  'text',
  'summary',
  'sourceUrl',
  'isArticle',
] as const) {}
