import { IsUUID, IsNotEmpty, IsOptional, IsBoolean, IsEnum, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import {
  galleryVideoKeywordMaxLen,
  galleryVideoTitleMaxLen,
  galleryVideoDescriptionMaxLen,
  VideoTypes,
  galleryArticleTitleMaxLen,
  galleryArticleKeywordMaxLen,
  galleryArticleSummaryMaxLen,
  galleryArticleTextMaxLen,
  galleryRecipeTitleMaxLen,
  galleryRecipeSummaryMaxLen,
  galleryRecipeKeywordMaxLen,
  galleryRecipeTextMaxLen,
  GalleryTypes,
  defaultOrderValue,
  orderFieldPattern,
} from '../../../../constants/enums/gallery.constants'
import { GalleryVideoEntity } from '../../../../database/entities/gallery-video.entity'
import { GalleryArticleEntity } from '../../../../database/entities/gallery-article.entity'
import { GalleryRecipeEntity } from '../../../../database/entities/gallery-recipe.entity'
import { TransformBooleanString } from '../../../../core/decorators/boolean-string-transform.decorator'
import { PaginationOptionsDTO } from '../../../../core/dtos/pagination'
import { messageWrapper } from '../../../../core/helpers/class-validation'
import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import { ApiPropertyOptional, IntersectionType, PickType, OmitType } from '@nestjs/swagger'
import {
  IsLimitedHtml,
  IsLimitedString,
  IsNotEmptyListLimitedStrings,
  IsListRelationStringsIds,
  IsListRelationUIIDs,
  IsNotEmptyRelationUIID,
  IsListLimitedStrings,
} from '../../../../core/decorators/gallery.decorators'
import { ConditionsEntity } from '../../../../database/entities/conditions.entity'
import { MedicationsEntity } from '../../../../database/entities/medications.entity'
import { TriggersEntity } from '../../../../database/entities/triggers.entity'

export class AddVideoDTO {
  @IsNotEmpty()
  @IsEnum(VideoTypes)
  type: VideoTypes

  @IsNotEmptyRelationUIID()
  videoId: string

  @IsNotEmptyRelationUIID()
  videoPreviewId: string

  @IsNotEmpty()
  @IsLimitedString(galleryVideoTitleMaxLen)
  titleEn: string

  @IsOptional()
  @IsLimitedString(galleryVideoTitleMaxLen)
  titleSp: string

  @IsNotEmptyListLimitedStrings(galleryVideoKeywordMaxLen)
  keywordsEn: string[]

  @IsOptional()
  @IsListLimitedStrings(galleryVideoKeywordMaxLen)
  keywordsSp: string[]

  @IsOptional()
  @IsListRelationUIIDs()
  conditions: string[] = []

  @IsOptional()
  @IsListRelationStringsIds()
  medications: string[] = []

  @IsOptional()
  @IsListRelationUIIDs()
  triggers: string[] = []

  @IsOptional()
  @IsLimitedHtml(galleryVideoDescriptionMaxLen)
  descriptionEn = ''

  @IsOptional()
  @IsLimitedHtml(galleryVideoDescriptionMaxLen)
  descriptionSp = ''

  @IsOptional()
  @IsBoolean()
  isPublished = false
}

export class AddArticleDTO {
  @IsNotEmptyRelationUIID()
  imageId: string

  @IsNotEmpty()
  @IsLimitedString(galleryArticleTitleMaxLen)
  titleEn: string

  @IsOptional()
  @IsLimitedString(galleryArticleTitleMaxLen)
  titleSp: string

  @IsNotEmpty()
  @IsLimitedString(galleryArticleSummaryMaxLen)
  summaryEn: string

  @IsOptional()
  @IsLimitedString(galleryArticleSummaryMaxLen)
  summarySp: string

  @IsNotEmptyListLimitedStrings(galleryArticleKeywordMaxLen)
  keywordsEn: string[]

  @IsOptional()
  @IsListLimitedStrings(galleryArticleKeywordMaxLen)
  keywordsSp: string[]

  @IsOptional()
  @IsListRelationUIIDs()
  conditions: string[] = []

  @IsOptional()
  @IsListRelationStringsIds()
  medications: string[] = []

  @IsOptional()
  @IsListRelationUIIDs()
  triggers: string[] = []

  @IsNotEmpty()
  @IsLimitedHtml(galleryArticleTextMaxLen)
  textEn: string

  @IsOptional()
  @IsLimitedHtml(galleryArticleTextMaxLen)
  textSp: string

  @IsOptional()
  @IsBoolean()
  isPublished = false
}

export class AddRecipeDTO {
  @IsNotEmpty()
  @IsUUID(4)
  imageId: string

  @IsNotEmpty()
  @IsLimitedString(galleryRecipeTitleMaxLen)
  titleEn: string

  @IsOptional()
  @IsLimitedString(galleryRecipeTitleMaxLen)
  titleSp: string

  @IsNotEmpty()
  @IsLimitedString(galleryRecipeSummaryMaxLen)
  summaryEn: string

  @IsOptional()
  @IsLimitedString(galleryRecipeSummaryMaxLen)
  summarySp: string

  @IsNotEmptyListLimitedStrings(galleryRecipeKeywordMaxLen)
  keywordsEn: string[]

  @IsOptional()
  @IsListLimitedStrings(galleryRecipeKeywordMaxLen)
  keywordsSp: string[]

  @IsNotEmpty()
  @IsLimitedHtml(galleryRecipeTextMaxLen)
  textEn: string

  @IsOptional()
  @IsLimitedHtml(galleryRecipeTextMaxLen)
  textSp: string

  @IsOptional()
  @IsBoolean()
  isPublished = false
}

export class SearchOptionsDTO {
  @ApiPropertyOptional()
  @IsOptional()
  search: string

  @ApiPropertyOptional({ enum: GalleryTypes })
  @IsOptional()
  @IsEnum(GalleryTypes)
  type: GalleryTypes

  @ApiPropertyOptional()
  @IsOptional()
  @TransformBooleanString()
  @IsBoolean()
  isPublished: boolean
}

export class GalleryPaginationOptionsDTO extends PaginationOptionsDTO {
  @ApiPropertyOptional({
    name: 'order',
    default: defaultOrderValue,
    enum: ['createAt asc', 'createAt desc', 'updateAt asc', 'updateAt desc'],
  })
  @Matches(orderFieldPattern, messageWrapper(DictionaryPathToken.InvalidOrderOptionFormatGallery))
  readonly order?: string = defaultOrderValue
}

export class GalleryVideosFilterOptionsDTO {
  @IsEnum(VideoTypes)
  type: VideoTypes
}
export class GalleryVideosListingOptionsDTO extends IntersectionType(
  GalleryPaginationOptionsDTO,
  GalleryVideosFilterOptionsDTO,
) {}
export class GalleryArticlesListingOptionsDTO extends GalleryPaginationOptionsDTO {}
export class GalleryRecipesListingOptionsDTO extends GalleryPaginationOptionsDTO {}

export class PatchVideoDTO {
  @IsOptional()
  @IsNotEmptyRelationUIID()
  videoId: string

  @IsOptional()
  @IsNotEmptyRelationUIID()
  videoPreviewId: string

  @IsOptional()
  @IsNotEmpty()
  @IsLimitedString(galleryVideoTitleMaxLen)
  titleEn: string

  @IsOptional()
  @IsLimitedString(galleryVideoTitleMaxLen)
  titleSp: string

  @IsOptional()
  @IsNotEmptyListLimitedStrings(galleryVideoKeywordMaxLen)
  keywordsEn: string[]

  @IsOptional()
  @IsListLimitedStrings(galleryVideoKeywordMaxLen)
  keywordsSp: string[]

  @IsOptional()
  @IsListRelationUIIDs()
  conditions: string[]

  @IsOptional()
  @IsListRelationStringsIds()
  medications: string[]

  @IsOptional()
  @IsListRelationUIIDs()
  triggers: string[]

  @IsOptional()
  @IsLimitedHtml(galleryVideoDescriptionMaxLen)
  descriptionEn: string

  @IsOptional()
  @IsLimitedHtml(galleryVideoDescriptionMaxLen)
  descriptionSp: string

  @IsOptional()
  @IsBoolean()
  isPublished: boolean
}

export class PatchArticleDTO {
  @IsOptional()
  @IsNotEmptyRelationUIID()
  imageId: string

  @IsOptional()
  @IsNotEmpty()
  @IsLimitedString(galleryArticleTitleMaxLen)
  titleEn: string

  @IsOptional()
  @IsLimitedString(galleryArticleTitleMaxLen)
  titleSp: string

  @IsOptional()
  @IsNotEmpty()
  @IsLimitedString(galleryArticleSummaryMaxLen)
  summaryEn: string

  @IsOptional()
  @IsLimitedString(galleryArticleSummaryMaxLen)
  summarySp: string

  @IsOptional()
  @IsNotEmptyListLimitedStrings(galleryArticleKeywordMaxLen)
  keywordsEn: string[]

  @IsOptional()
  @IsListLimitedStrings(galleryArticleKeywordMaxLen)
  keywordsSp: string[]

  @IsOptional()
  @IsListRelationUIIDs()
  conditions: string[]

  @IsOptional()
  @IsListRelationStringsIds()
  medications: string[]

  @IsOptional()
  @IsListRelationUIIDs()
  triggers: string[]

  @IsOptional()
  @IsNotEmpty()
  @IsLimitedHtml(galleryArticleTextMaxLen)
  textEn: string

  @IsOptional()
  @IsLimitedHtml(galleryArticleTextMaxLen)
  textSp: string

  @IsOptional()
  @IsBoolean()
  isPublished: boolean
}

export class PatchRecipeDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsUUID(4)
  imageId: string

  @IsOptional()
  @IsNotEmpty()
  @IsLimitedString(galleryRecipeTitleMaxLen)
  titleEn: string

  @IsOptional()
  @IsLimitedString(galleryRecipeTitleMaxLen)
  titleSp: string

  @IsOptional()
  @IsNotEmpty()
  @IsLimitedString(galleryRecipeSummaryMaxLen)
  summaryEn: string

  @IsOptional()
  @IsLimitedString(galleryRecipeSummaryMaxLen)
  summarySp: string

  @IsOptional()
  @IsNotEmptyListLimitedStrings(galleryRecipeKeywordMaxLen)
  keywordsEn: string[]

  @IsOptional()
  @IsListLimitedStrings(galleryRecipeKeywordMaxLen)
  keywordsSp: string[]

  @IsOptional()
  @IsNotEmpty()
  @IsLimitedHtml(galleryRecipeTextMaxLen)
  textEn: string

  @IsOptional()
  @IsLimitedHtml(galleryRecipeTextMaxLen)
  textSp: string

  @IsOptional()
  @IsBoolean()
  isPublished: boolean
}

class OverrideConditions extends PickType(ConditionsEntity, ['id', 'name', 'description'] as const) {}
class OverrideMedications extends PickType(MedicationsEntity, ['id', 'productId', 'name', 'dose', 'units'] as const) {}
class OverrideTriggers extends PickType(TriggersEntity, ['id', 'shortName', 'description'] as const) {}

class OverrideGetGalleryVideoFields {
  conditions: OverrideConditions[]
  medications: OverrideMedications[]
  triggers: OverrideTriggers[]
}
class AdditionalGalleryVideoFields {
  @ApiProperty()
  previewImagePresignedLink: string | null
}

export class BaseGalleryVideoResponseDTO extends IntersectionType(
  OmitType(GalleryVideoEntity, ['userVideos' as const]),
  OverrideGetGalleryVideoFields,
) {}
export class PostGalleryVideoResponseDTO extends BaseGalleryVideoResponseDTO {}
export class PatchGalleryVideoResponseDTO extends BaseGalleryVideoResponseDTO {}
export class GetGalleryVideoResponseDTO extends IntersectionType(
  BaseGalleryVideoResponseDTO,
  AdditionalGalleryVideoFields,
) {}

class OverrideGetGalleryArticleFields {
  conditions: OverrideConditions[]
  medications: OverrideMedications[]
  triggers: OverrideTriggers[]
}

class AdditionalGalleryArticleFields {
  @ApiProperty()
  previewImagePresignedLink: string | null
}

export class BaseGalleryArticleResponseDTO extends IntersectionType(
  OmitType(GalleryArticleEntity, ['userArticles' as const]),
  OverrideGetGalleryArticleFields,
) {}
export class PostGalleryArticleResponseDTO extends BaseGalleryArticleResponseDTO {}
export class PatchGalleryArticleResponseDTO extends BaseGalleryArticleResponseDTO {}
export class GetGalleryArticleResponseDTO extends IntersectionType(
  BaseGalleryArticleResponseDTO,
  AdditionalGalleryArticleFields,
) {}

class AdditionalRecipeFields {
  @ApiProperty()
  previewImagePresignedLink: string | null
}
export class BaseGalleryRecipeResponseDTO extends OmitType(GalleryRecipeEntity, ['userRecipes' as const]) {}
export class PostGalleryRecipeResponseDTO extends BaseGalleryRecipeResponseDTO {}
export class PatchGalleryRecipeResponseDTO extends BaseGalleryRecipeResponseDTO {}
export class GetGalleryRecipeResponseDTO extends IntersectionType(
  BaseGalleryRecipeResponseDTO,
  AdditionalRecipeFields,
) {}

export class GallerySearchResponseDTO {
  videos: GetGalleryVideoResponseDTO[]
  articles: GetGalleryArticleResponseDTO[]
  recipes: GetGalleryRecipeResponseDTO[]
}
