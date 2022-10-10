import { PaginationOptionsDTO } from '../../../../core/dtos/pagination'
import {
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator'
import { messageWrapper } from '../../../../core/helpers/class-validation'
import { DictionaryPathToken } from '../../../../constants/dictionary.constants'
import {
  customNotificationContentMaxLen,
  customNotificationNameMaxLen,
  CustomNotificationSendingStrategy,
  CustomNotificationStatus,
  defaultOrderValueCustom,
  defaultOrderValuePredefined,
  NotificationKind,
  orderFieldPatternCustom,
  orderFieldPatternPredefined,
  predefinedNotificationContentMaxLen,
} from '../../../../constants/enums/notifications.constants'
import { ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator'
import { IntersectionType } from '@nestjs/swagger'
import {
  IsLimitedHtml,
  IsLimitedString,
  IsListRelationUIIDs,
  IsNotEmptyRelationUIID,
} from '../../../../core/decorators/gallery.decorators'
import { StorageEntity } from '../../../../database/entities/storage.entity'
import { GalleryVideoEntity } from '../../../../database/entities/gallery-video.entity'
import { GalleryArticleEntity } from '../../../../database/entities/gallery-article.entity'
import { GalleryRecipeEntity } from '../../../../database/entities/gallery-recipe.entity'
import { Type } from 'class-transformer'
import { ValidateNowOrDate } from '../../../../core/decorators/now-or-date.validator'
import { TargetGroupEntity } from '../../../../database/entities/target-group.entity'
import { NotificationPredefinedEntity } from '../../../../database/entities/notification-predefined.entity'

export class CustomNotificationsPaginationOptionsDTO extends PaginationOptionsDTO {
  @Matches(orderFieldPatternCustom, messageWrapper(DictionaryPathToken.InvalidOrderOptionFormatGallery))
  readonly order?: string = defaultOrderValueCustom
}

export class PredefinedNotificationsPaginationOptionsDTO extends PaginationOptionsDTO {
  @Matches(orderFieldPatternPredefined, messageWrapper(DictionaryPathToken.InvalidOrderOptionFormatGallery))
  readonly order?: string = defaultOrderValuePredefined
}

export class NotificationsSearchParamsDTO {
  @IsOptional()
  @ApiModelPropertyOptional()
  @IsString()
  search?: string
}

export class CustomNotificationsListingOptionsDTO extends IntersectionType(
  CustomNotificationsPaginationOptionsDTO,
  NotificationsSearchParamsDTO,
) {
  sending_strategy?: CustomNotificationSendingStrategy
  isToday?: boolean
}

export class PredefinedNotificationsListingOptionsDTO extends IntersectionType(
  PredefinedNotificationsPaginationOptionsDTO,
  NotificationsSearchParamsDTO,
) {}

export class PatchPredefinedNotificationDTO {
  @IsOptional()
  @IsLimitedHtml(predefinedNotificationContentMaxLen)
  contentEn?: string

  @IsOptional()
  @IsLimitedHtml(predefinedNotificationContentMaxLen)
  contentSp?: string

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean
}

export class PatchPredefinedNotificationResponseDTO extends NotificationPredefinedEntity {}

export enum CustomNotificationLinkType {
  video = 'video',
  article = 'article',
  recipe = 'recipe',
}
export type CustomNotificationLinkValue = GalleryVideoEntity | GalleryArticleEntity | GalleryRecipeEntity

export class GetPredefinedNotificationResponseDTO extends NotificationPredefinedEntity {}

export class GetCustomNotificationResponseDTO {
  id: string
  createAt: Date
  updateAt: Date
  status: CustomNotificationStatus
  notification_type: NotificationKind
  name: string
  contentEn: string
  contentSp: string
  image: StorageEntity
  targetGroups: TargetGroupEntity[]
  link: {
    type: CustomNotificationLinkType
    value: CustomNotificationLinkValue
  }
  sending_date: string
  actual_send_date: Date
}

export class CustomNotificationLinkDTO {
  @IsEnum(CustomNotificationLinkType)
  type: CustomNotificationLinkType

  @IsNotEmptyRelationUIID()
  linkId: string
}

export class AddCustomNotificationDTO {
  @IsNotEmpty()
  @IsLimitedString(customNotificationNameMaxLen)
  name: string

  @IsNotEmpty()
  @IsLimitedString(customNotificationContentMaxLen)
  contentEn: string

  @IsOptional()
  @IsLimitedString(customNotificationContentMaxLen)
  contentSp: string

  @IsOptional()
  @IsNotEmptyRelationUIID()
  imageId: string

  @ArrayNotEmpty()
  @IsListRelationUIIDs()
  targetGroups: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomNotificationLinkDTO)
  link: CustomNotificationLinkDTO

  @IsNotEmpty()
  @IsString()
  @ValidateNowOrDate()
  sending_date: string
}

export class PostCustomNotificationResponseDTO extends GetCustomNotificationResponseDTO {}

export class PatchCustomNotificationDTO {
  @IsOptional()
  @IsLimitedString(customNotificationNameMaxLen)
  name: string

  @IsOptional()
  @IsLimitedString(customNotificationContentMaxLen)
  contentEn: string

  @IsOptional()
  @IsLimitedString(customNotificationContentMaxLen)
  contentSp: string

  @IsOptional()
  @IsNotEmptyRelationUIID()
  imageId: string

  @IsOptional()
  @ArrayNotEmpty()
  @IsListRelationUIIDs()
  targetGroups: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomNotificationLinkDTO)
  link: CustomNotificationLinkDTO

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ValidateNowOrDate()
  sending_date: string
}

export class PatchCustomNotificationResponseDTO extends GetCustomNotificationResponseDTO {}
