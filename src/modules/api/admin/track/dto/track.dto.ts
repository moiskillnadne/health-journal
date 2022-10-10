import { PaginationOptionsDTO } from '../../../../../core/dtos/pagination'
import { IsOptional, Matches } from 'class-validator'
import { messageWrapper } from '../../../../../core/helpers/class-validation'
import { DictionaryPathToken } from '../../../../../constants/dictionary.constants'
import {
  defaultOrderValue,
  orderFieldPattern,
  TrackGroupSchedulePeriod,
} from '../../../../../constants/enums/track.constants'
import { IntersectionType, OmitType } from '@nestjs/swagger'
import { GalleryVideoEntity } from '../../../../../database/entities/gallery-video.entity'
import { GalleryArticleEntity } from '../../../../../database/entities/gallery-article.entity'
import { GalleryRecipeEntity } from '../../../../../database/entities/gallery-recipe.entity'
import { TargetGroupEntity } from '../../../../../database/entities/target-group.entity'
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'

export class TrackPaginationOptionsDTO extends PaginationOptionsDTO {
  @Matches(orderFieldPattern, messageWrapper(DictionaryPathToken.InvalidOrderOptionFormatTrack))
  readonly order?: string = defaultOrderValue
}

export class TrackListingSearchOptionsDTO {
  @IsOptional()
  @ApiModelPropertyOptional()
  search: string
}

export class TrackListingOptionsDTO extends IntersectionType(TrackPaginationOptionsDTO, TrackListingSearchOptionsDTO) {}

class GalleryVideo extends OmitType(GalleryVideoEntity, [
  'video',
  'videoPreview',
  'conditions',
  'medications',
  'triggers',
] as const) {}

class GalleryArticle extends OmitType(GalleryArticleEntity, [
  'image',
  'conditions',
  'medications',
  'triggers',
] as const) {}

class GalleryRecipe extends OmitType(GalleryRecipeEntity, ['image'] as const) {}

class TrackGroupLineResponseDTO {
  id: string
  order: number
  video?: GalleryVideo
  article?: GalleryArticle
  recipe?: GalleryRecipe
}
class TrackGroupResponseDto {
  order: number
  schedule: TrackGroupSchedulePeriod
  lines: TrackGroupLineResponseDTO[]
}

export class TrackResponseDTO {
  titleEn: string
  titleSp: string
  targetGroups: TargetGroupEntity[]
  groups: TrackGroupResponseDto[]
  isPublished: boolean
}

class AdditionalDaysProperty {
  days: number
}

export class GetTrackResponseDTO extends IntersectionType(TrackResponseDTO, AdditionalDaysProperty) {}
