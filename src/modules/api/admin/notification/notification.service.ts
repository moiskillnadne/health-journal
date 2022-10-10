import { HttpStatus, Injectable } from '@nestjs/common'
import { PageDTO, PageMetaDTO } from '../../../../core/dtos/pagination'
import {
  AddCustomNotificationDTO,
  CustomNotificationLinkDTO,
  CustomNotificationLinkType,
  CustomNotificationsListingOptionsDTO,
  GetCustomNotificationResponseDTO,
  GetPredefinedNotificationResponseDTO,
  PatchCustomNotificationDTO,
  PatchPredefinedNotificationDTO,
  PredefinedNotificationsListingOptionsDTO,
} from './notification.dto'
import { NotificationCustomCrud } from './crud/notification-custom.crud'
import { NotificationPredefinedCrud } from './crud/notification-predefined.crud'
import { NotificationCustomEntity } from '../../../../database/entities/notification-custom.entity'
import { NotFoundError } from '../../../../core/errors/not-found.error'
import { DictionaryErrorMessages } from '../../../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../../../constants/responses/codes.error.constants'
import { NotificationPredefinedEntity } from '../../../../database/entities/notification-predefined.entity'
import { GalleryVideoEntity } from '../../../../database/entities/gallery-video.entity'
import { GalleryArticleEntity } from '../../../../database/entities/gallery-article.entity'
import { GalleryRecipeEntity } from '../../../../database/entities/gallery-recipe.entity'
import {
  CustomNotificationSendingStrategy,
  CustomNotificationStatus,
} from '../../../../constants/enums/notifications.constants'
import { TargetGroupCrud } from '../../target-group/target-group.crud'
import { TargetGroupEntity } from '../../../../database/entities/target-group.entity'
import { ValidationError } from '../../../../core/errors/validation.error'
import { StorageEntity } from '../../../../database/entities/storage.entity'
import { StorageContentTypes } from '../../../../constants/enums/storage.constants'
import { StorageEntityService } from '../storage/storage-entity.service'
import { GalleryVideoCrud } from '../gallery/crud/gallery-video.crud'
import { GalleryArticleCrud } from '../gallery/crud/gallery-article.crud'
import { GalleryRecipeCrud } from '../gallery/crud/gallery-recipe.crud'
import { BaseEntity } from '../../../../database/base-entities/base.entity'
import { SendNotificationsService as SendCustomNotificationsService } from '../../../../core/notifications/custom/send-notifications.service'

@Injectable()
export class NotificationService {
  constructor(
    private notificationCustomCrud: NotificationCustomCrud,
    private notificationPredefinedCrud: NotificationPredefinedCrud,
    private targetGroupCrud: TargetGroupCrud,
    private storageEntityService: StorageEntityService,
    private galleryVideoCrud: GalleryVideoCrud,
    private galleryArticleCrud: GalleryArticleCrud,
    private galleryRecipeCrud: GalleryRecipeCrud,
    private sendCustomNotificationsService: SendCustomNotificationsService,
  ) {}

  public async getPredefinedNotifications(
    options: PredefinedNotificationsListingOptionsDTO,
  ): Promise<PageDTO<GetPredefinedNotificationResponseDTO>> {
    const { entities, totalCount } = await this.notificationPredefinedCrud.getItemsByFilterParams(options)

    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: options, itemCount: totalCount })

    return new PageDTO(entities, pageMetaDto)
  }

  public async updatePredefinedNotification(
    id: string,
    patchPredefinedNotificationDTO: PatchPredefinedNotificationDTO,
  ): Promise<NotificationPredefinedEntity> {
    const notification = await this.notificationPredefinedCrud.getPredefinedNotificationById(id)
    if (!notification) {
      throw new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND)
    }

    const updateParams = this.prepareSimplePatchParams(notification, patchPredefinedNotificationDTO, [
      'contentEn',
      'contentSp',
      'isPublished',
    ])

    if (Object.values(updateParams).length) {
      await this.notificationPredefinedCrud.update(notification, updateParams)
    }

    return this.notificationPredefinedCrud.getPredefinedNotificationById(id)
  }

  prepareSimplePatchParams(
    entity: NotificationPredefinedEntity | NotificationCustomEntity,
    patchOptions: PatchPredefinedNotificationDTO | PatchCustomNotificationDTO,
    fields: Array<keyof NotificationPredefinedEntity | keyof NotificationCustomEntity>,
  ) {
    const result = {}
    for (const field of fields) {
      if (
        patchOptions.hasOwnProperty(field) &&
        patchOptions[field] !== undefined &&
        entity[field] !== patchOptions[field]
      ) {
        result[field] = patchOptions[field]
      }
    }

    return result
  }

  public async getCustomNotifications(
    options: CustomNotificationsListingOptionsDTO,
  ): Promise<PageDTO<GetCustomNotificationResponseDTO>> {
    const { entities, totalCount } = await this.notificationCustomCrud.getItemsByFilterParams(options)
    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: options, itemCount: totalCount })

    return new PageDTO(this.transformCustomNotificationsToResponse(entities), pageMetaDto)
  }

  private getLinkedGalleryItemType(notification: NotificationCustomEntity): CustomNotificationLinkType | null {
    if (notification.video && notification.video.isPublished) {
      return CustomNotificationLinkType.video
    } else if (notification.article && notification.article.isPublished) {
      return CustomNotificationLinkType.article
    } else if (notification.recipe && notification.recipe.isPublished) {
      return CustomNotificationLinkType.recipe
    }
    return null
  }

  private getLinkedGalleryItem(
    notification: NotificationCustomEntity,
  ): GalleryVideoEntity | GalleryArticleEntity | GalleryRecipeEntity {
    return notification.video ?? notification.article ?? notification.recipe ?? null
  }

  private transformCustomNotificationsToResponse(
    customNotifications: NotificationCustomEntity[],
  ): GetCustomNotificationResponseDTO[] {
    return customNotifications.map((notification) => this.transformCustomNotificationToResponse(notification))
  }

  private transformCustomNotificationToResponse(
    notification: NotificationCustomEntity,
  ): GetCustomNotificationResponseDTO {
    return {
      id: notification.id,
      updateAt: notification.updateAt,
      createAt: notification.createAt,
      status:
        notification.sending_strategy === CustomNotificationSendingStrategy.Immediately
          ? CustomNotificationStatus.Completed
          : CustomNotificationStatus.Scheduled,
      notification_type: notification.notification_type,
      name: notification.name,
      contentEn: notification.contentEn,
      contentSp: notification.contentSp,
      image: notification.image,
      ...(this.getLinkedGalleryItemType(notification)
        ? {
            link: {
              type: this.getLinkedGalleryItemType(notification),
              value: this.getLinkedGalleryItem(notification),
            },
          }
        : { link: null }),
      sending_date:
        notification.sending_strategy === CustomNotificationSendingStrategy.Immediately
          ? 'now'
          : this.prepareSendingDate(notification.sending_date),
      actual_send_date: notification.sending_date,
      targetGroups: notification.targetGroups,
    }
  }

  public async addCustomNotification(addOptions: AddCustomNotificationDTO) {
    let image = null
    if (addOptions.imageId) {
      image = await this.storageEntityService.getStorageItemById(addOptions.imageId)
      this.validateImage(image, 'imageId')
    }
    const notification = await this.notificationCustomCrud.save({
      ...{
        name: addOptions.name,
        contentEn: addOptions.contentEn,
        contentSp: addOptions.contentSp,
        targetGroups: await this.prepareTargetGroups(addOptions.targetGroups),
        sending_strategy:
          addOptions.sending_date === 'now'
            ? CustomNotificationSendingStrategy.Immediately
            : CustomNotificationSendingStrategy.Scheduled,
        sending_date: addOptions.sending_date === 'now' ? new Date() : new Date(addOptions.sending_date),

        image: image,
      },
      ...(await this.prepareCustomNotificationLink(addOptions.link)),
    })

    if (notification.sending_strategy === CustomNotificationSendingStrategy.Immediately) {
      await this.sendCustomNotificationsService.sendImmediately(notification)
    }

    return this.transformCustomNotificationToResponse(notification)
  }

  private prepareSendingDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  public async patchCustomNotification(notificationId: string, patchOptions: PatchCustomNotificationDTO) {
    const notification = await this.notificationCustomCrud.getNotificationById(notificationId, [
      'image',
      'video',
      'article',
      'recipe',
      'targetGroups',
    ])
    if (!notification) {
      throw new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND)
    }
    const updateData = this.prepareSimplePatchParams(notification, patchOptions, ['name', 'contentEn', 'contentSp'])

    if (patchOptions.imageId !== undefined && patchOptions.imageId !== notification.image?.id) {
      let image = null
      if (patchOptions.imageId !== null) {
        image = await this.storageEntityService.getStorageItemById(patchOptions.imageId)
        this.validateImage(image, 'imageId')
      }
      updateData['image'] = image
    }

    if (patchOptions.targetGroups !== undefined) {
      const updateTargetGroupsData = await this.prepareUpdateNotificationRelationData(
        patchOptions.targetGroups,
        notification.targetGroups,
        (ids) => this.targetGroupCrud.getTargetGroupsByIds(ids),
        this.validateTargetGroups,
      )
      if (updateTargetGroupsData) {
        updateData['targetGroups'] = updateTargetGroupsData
      }
    }

    if (patchOptions.link !== undefined) {
      const requestLink = await this.prepareCustomNotificationLink(patchOptions.link)
      if (Object.keys(requestLink).length) {
        const relationPropName = Object.keys(requestLink)[0]
        const relationValue = Object.values(requestLink)[0]
        if (notification[relationPropName] === null || notification[relationPropName]?.id !== relationValue?.id) {
          updateData['video'] = relationPropName === 'video' ? relationValue : null
          updateData['article'] = relationPropName === 'article' ? relationValue : null
          updateData['recipe'] = relationPropName === 'recipe' ? relationValue : null
        }
      } else {
        updateData['video'] = null
        updateData['article'] = null
        updateData['recipe'] = null
      }
    }

    if (patchOptions.sending_date !== undefined) {
      if (patchOptions.sending_date === 'now') {
        updateData['sending_strategy'] = CustomNotificationSendingStrategy.Immediately
        updateData['sending_date'] = new Date()
      } else {
        updateData['sending_strategy'] = CustomNotificationSendingStrategy.Scheduled
        updateData['sending_date'] = new Date(patchOptions.sending_date)
      }
    }

    await this.notificationCustomCrud.update(notification, updateData)

    const updatedNotification = await this.notificationCustomCrud.getNotificationById(notificationId, [
      'image',
      'video',
      'article',
      'recipe',
      'targetGroups',
    ])

    if (updatedNotification.sending_strategy === CustomNotificationSendingStrategy.Immediately) {
      await this.sendCustomNotificationsService.sendImmediately(notification)
    }

    return this.transformCustomNotificationToResponse(updatedNotification)
  }

  private async prepareUpdateNotificationRelationData(
    updateRelatedEntitiesIds: string[],
    currentRelatedEntities: BaseEntity[],
    relatedEntitiesGetter: (ids: string[]) => Promise<BaseEntity[]>,
    relatedEntitiesValidator: (entityIds: string[], entities) => void,
    relatedEntitiesPrimaryField = 'id',
  ) {
    const newRelatedEntities = await relatedEntitiesGetter(updateRelatedEntitiesIds)
    relatedEntitiesValidator(updateRelatedEntitiesIds, newRelatedEntities)

    const existedRelatedEntities = currentRelatedEntities.filter((relatedEntity) => {
      return updateRelatedEntitiesIds.includes(relatedEntity[relatedEntitiesPrimaryField])
    })
    const existedRelatedEntitiesIds = existedRelatedEntities.map(
      (relatedEntity) => relatedEntity[relatedEntitiesPrimaryField],
    )
    const add = newRelatedEntities.filter(
      (relatedEntity) => !existedRelatedEntitiesIds.includes(relatedEntity[relatedEntitiesPrimaryField]),
    )
    const remove = currentRelatedEntities.filter(
      (relatedEntity) => !updateRelatedEntitiesIds.includes(relatedEntity[relatedEntitiesPrimaryField]),
    )
    if (add.length || remove.length) {
      return { add, remove }
    }
  }

  private async prepareCustomNotificationLink(linkDTO?: CustomNotificationLinkDTO): Promise<{
    video?: GalleryVideoEntity
    article?: GalleryArticleEntity
    recipe?: GalleryRecipeEntity
  }> {
    const result = {}
    if (linkDTO) {
      const typeToGetterMap = {
        video: (id) => this.galleryVideoCrud.getGalleryVideoById(id),
        article: (id) => this.galleryArticleCrud.getGalleryArticleById(id),
        recipe: (id) => this.galleryRecipeCrud.getGalleryRecipeById(id),
      }
      const linkEntity = await typeToGetterMap[linkDTO.type](linkDTO.linkId)
      if (!linkEntity) {
        throw new ValidationError(
          DictionaryErrorMessages.ValidationFailed,
          ErrorCodes.ValidationFailedRelatedEntityNotFound,
          HttpStatus.BAD_REQUEST,
          { field: 'link' },
        )
      }

      result[linkDTO.type] = linkEntity
    }
    return result
  }

  private validateImage(image: StorageEntity | null, fieldName: string) {
    if (!image) {
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedRelatedEntityNotFound,
        HttpStatus.BAD_REQUEST,
        { field: fieldName },
      )
    }
    if (image.contentType !== StorageContentTypes.image) {
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedInvalidStorageItemType,
        HttpStatus.BAD_REQUEST,
        { field: fieldName },
      )
    }
  }

  private async prepareTargetGroups(targetGroupsIds: string[]) {
    const targetGroups = await this.targetGroupCrud.getTargetGroupsByIds(targetGroupsIds)
    this.validateTargetGroups(targetGroupsIds, targetGroups)

    return targetGroups
  }

  private validateTargetGroups(targetGroupsIds: string[], targetGroups: TargetGroupEntity[]) {
    if (targetGroupsIds.length !== targetGroups.length) {
      const existTargetGroupsIds = targetGroups.map((targetGroup) => targetGroup.id)
      const notExistTargetGroupsIds = targetGroupsIds.filter(
        (targetGroupId) => !existTargetGroupsIds.includes(targetGroupId),
      )
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedSomeEntitiesNotFound,
        HttpStatus.BAD_REQUEST,
        { field: 'targetGroups', ids: notExistTargetGroupsIds },
      )
    }
  }
}
