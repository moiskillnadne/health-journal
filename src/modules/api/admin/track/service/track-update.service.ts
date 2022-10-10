import { HttpStatus, Injectable } from '@nestjs/common'
import { PatchTrackDTO, PatchTrackGroupDto, PatchTrackGroupLineDTO } from '../dto/track-update.dto'
import { TrackCrud } from '../crud/track.crud'
import { NotFoundError } from '../../../../../core/errors/not-found.error'
import { DictionaryErrorMessages } from '../../../../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../../../../constants/responses/codes.error.constants'
import { BaseEntity } from '../../../../../database/base-entities/base.entity'
import { TargetGroupCrud } from '../../../target-group/target-group.crud'
import { TargetGroupEntity } from '../../../../../database/entities/target-group.entity'
import { ValidationError } from '../../../../../core/errors/validation.error'
import { TrackGroupCrud } from '../crud/track-group.crud'
import { TrackGroupEntity } from '../../../../../database/entities/track-group.entity'
import { TrackGroupLineCrud } from '../crud/track-group-line.crud'
import { GalleryVideoCrud } from '../../gallery/crud/gallery-video.crud'
import { GalleryArticleCrud } from '../../gallery/crud/gallery-article.crud'
import { GalleryRecipeCrud } from '../../gallery/crud/gallery-recipe.crud'
import { GalleryVideoEntity } from '../../../../../database/entities/gallery-video.entity'
import { GalleryArticleEntity } from '../../../../../database/entities/gallery-article.entity'
import { GalleryRecipeEntity } from '../../../../../database/entities/gallery-recipe.entity'
import { TrackGroupLineEntity } from '../../../../../database/entities/track-group-line.entity'
import { TrackEntity } from '../../../../../database/entities/track.entity'
import { UserTracksService } from '../../../user-tracks/user-tracks.service'
import { UpdatesHandler as PredefinedNotificationsTrackUpdatesHandler } from '../../../../../core/notifications/predefined/handlers/jorney-tasks/updates.handler'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationPredefinedEntity } from '../../../../../database/entities/notification-predefined.entity'
import { Repository } from 'typeorm'
import { NotificationType } from '../../../../../constants/enums/notifications.constants'

@Injectable()
export class TrackUpdateService {
  constructor(
    private trackCrud: TrackCrud,
    private trackGroupCrud: TrackGroupCrud,
    private trackGroupLineCrud: TrackGroupLineCrud,
    private targetGroupCrud: TargetGroupCrud,
    private galleryVideoCrud: GalleryVideoCrud,
    private galleryArticleCrud: GalleryArticleCrud,
    private galleryRecipeCrud: GalleryRecipeCrud,
    private userTracksService: UserTracksService,
    private trackUpdatesNotificationsHandler: PredefinedNotificationsTrackUpdatesHandler,
    @InjectRepository(NotificationPredefinedEntity)
    private notificationPredefinedEntityRepository: Repository<NotificationPredefinedEntity>,
  ) {}

  async updateTrack(trackId: string, patchTrackDTO: PatchTrackDTO) {
    const currentTrack = await this.trackCrud.getTrackById(trackId, ['targetGroups', 'groups'])
    if (!currentTrack) {
      throw new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND)
    }

    const updateTrackData = this.prepareUpdateTrackData(currentTrack, patchTrackDTO, [
      'titleEn',
      'titleSp',
      'isPublished',
    ])
    if (patchTrackDTO.targetGroups !== undefined) {
      const updateTargetGroupsData = await this.prepareUpdateTrackRelationData(
        patchTrackDTO.targetGroups,
        currentTrack.targetGroups,
        (ids) => this.targetGroupCrud.getTargetGroupsByIds(ids),
        this.validateTargetGroups,
      )
      if (updateTargetGroupsData) {
        updateTrackData['targetGroups'] = updateTargetGroupsData
      }
    }

    const updateGroupsData = []
    const addGroupsData = []
    let removeGroupsData = []
    let updateGroupsLinesData = []
    let addGroupsLinesData = []
    let removeGroupsLinesData = []

    if (patchTrackDTO.groups !== undefined) {
      removeGroupsData = this.getRemoveItems(currentTrack.groups, patchTrackDTO.groups)
      if (removeGroupsData.length) {
        throw new ValidationError(
          DictionaryErrorMessages.ValidationFailed,
          ErrorCodes.ValidationFailedSRemoveTrackGroupsNotAllowed,
          HttpStatus.BAD_REQUEST,
        )
      }

      const receivedGalleryRelationsMap = await this.getReceivedGalleryRelationsMap(patchTrackDTO.groups)
      const receivedTrackGroupsMap = await this.getReceivedTrackGroupsMap(patchTrackDTO.groups)
      const receivedTrackGroupsLinesMap = await this.getReceivedTrackGroupsLinesMap(patchTrackDTO.groups)

      for (const receivedUpdateTrackGroup of this.getReceivedUpdateItems(patchTrackDTO.groups)) {
        const currentTrackGroup = receivedTrackGroupsMap[receivedUpdateTrackGroup.id]

        const updateTrackGroupData = this.prepareUpdateTrackGroupData(currentTrackGroup, receivedUpdateTrackGroup)
        if (Object.keys(updateTrackGroupData).length) {
          updateGroupsData.push({ ...updateTrackGroupData, ...{ id: currentTrackGroup.id } })
        }

        const removeLines = this.getRemoveItems(currentTrackGroup.lines, receivedUpdateTrackGroup.lines)
        const addLines = this.prepareAddTrackGroupLinesData(
          receivedUpdateTrackGroup.lines,
          receivedGalleryRelationsMap,
          currentTrackGroup,
        )
        const updateLines = this.prepareUpdateTrackGroupsLinesData(
          receivedUpdateTrackGroup.lines,
          receivedTrackGroupsLinesMap,
          receivedGalleryRelationsMap,
        )
        addGroupsLinesData = [...addGroupsLinesData, ...addLines]
        removeGroupsLinesData = [...removeGroupsLinesData, ...removeLines]
        updateGroupsLinesData = [...updateGroupsLinesData, ...updateLines]
      }

      for (const receivedTrackGroup of this.getReceivedAddItems(patchTrackDTO.groups)) {
        const addGroupData = {
          track: currentTrack,
          order: receivedTrackGroup.order,
          schedule: receivedTrackGroup.schedule,
          lines: [],
        }
        for (const receivedTrackGroupLine of receivedTrackGroup.lines) {
          addGroupData.lines.push({
            order: receivedTrackGroupLine.order,
            video: receivedTrackGroupLine.video,
            article: receivedTrackGroupLine.article,
            recipe: receivedTrackGroupLine.recipe,
          })
        }
        addGroupsData.push(addGroupData)
      }
    }

    await this.trackCrud.update(currentTrack, {
      updateTrackData,
      addGroupsData,
      updateGroupsData,
      removeGroupsData,
      addGroupsLinesData,
      updateGroupsLinesData,
      removeGroupsLinesData,
    })

    const updatedTrack = await this.trackCrud.getTrackById(trackId, [
      'targetGroups',
      'groups',
      'groups.lines',
      'groups.lines.video',
      'groups.lines.article',
      'groups.lines.recipe',
    ])

    if (updatedTrack.isPublished) {
      if (
        (await this.notificationPredefinedEntityRepository.findOneBy({ type: NotificationType.TrackTasksUpdated }))
          .isPublished
      ) {
        await this.trackUpdatesNotificationsHandler.handleNotifications(trackId)
      }
      await this.userTracksService.assignTracksToUsersByTrackId(trackId)
    }

    return updatedTrack
  }

  prepareUpdateTrackData(track: TrackEntity, patchDTO: PatchTrackDTO, fields: Array<keyof TrackEntity>) {
    const result = {}
    for (const field of fields) {
      if (patchDTO.hasOwnProperty(field) && patchDTO[field] !== undefined && track[field] !== patchDTO[field]) {
        result[field] = patchDTO[field]
      }
    }
    return result
  }

  prepareUpdateTrackGroupData(currentTrackGroup: TrackGroupEntity, updateData: PatchTrackGroupDto) {
    const updateGroupData = {}
    for (const fieldName of ['order', 'schedule']) {
      if (currentTrackGroup?.[fieldName] !== updateData?.[fieldName]) {
        updateGroupData[fieldName] = updateData?.[fieldName]
      }
    }
    return updateGroupData
  }

  mapById<T extends { id: string }>(entities: Array<T>): { [key: string]: T } {
    return entities.reduce((result, item) => ({ ...result, ...{ [item.id]: item } }), {})
  }

  getReceivedUpdateItems<T extends { id?: string }>(receivedEntities: Array<T>): Array<T> {
    return receivedEntities.filter((entity) => entity?.id)
  }

  getReceivedAddItems<T extends { id?: string }>(receivedEntities: Array<T>): Array<T> {
    return receivedEntities.filter((entity) => !entity?.id)
  }

  getRemoveItems<T extends { id: string }, P extends { id?: string }>(
    currentEntities: T[],
    receivedUpdatesEntities: P[],
  ): T[] {
    const updateEntities = this.getReceivedUpdateItems(receivedUpdatesEntities)
    const updatesEntitiesIds = updateEntities.map((line) => line.id)
    return currentEntities.filter((entity) => !updatesEntitiesIds.includes(entity.id))
  }

  async getReceivedTrackGroupsMap(patchTrackGroups: PatchTrackGroupDto[]) {
    const receivedTrackGroups = this.getReceivedUpdateItems(patchTrackGroups)
    const receivedGroupsIds = receivedTrackGroups.map((trackGroup) => trackGroup.id)
    const existedTrackGroups = await this.trackGroupCrud.getTrackGroupsListByIds(receivedGroupsIds, [
      'lines',
      'lines.video',
      'lines.article',
      'lines.recipe',
    ])
    this.validateTrackGroups(receivedGroupsIds, existedTrackGroups)
    return this.mapById(existedTrackGroups)
  }

  validateTrackGroups(trackGroupsIds: string[], trackGroups: TrackGroupEntity[]) {
    if (trackGroupsIds.length !== trackGroups.length) {
      const existTrackGroupsIds = trackGroups.map((trackGroup) => trackGroup.id)
      const notExistTrackGroupsIds = existTrackGroupsIds.filter(
        (trackGroupId) => !notExistTrackGroupsIds.includes(trackGroupId),
      )
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedSomeEntitiesNotFound,
        HttpStatus.BAD_REQUEST,
        { field: 'groups', ids: notExistTrackGroupsIds },
      )
    }
  }

  async getReceivedTrackGroupsLinesMap(patchTrackGroups: PatchTrackGroupDto[]) {
    let allReceivedUpdateTrackGroupLinesIds = []
    for (const patchTrackGroup of patchTrackGroups) {
      const receivedUpdateTrackGroupLines = this.getReceivedUpdateItems(patchTrackGroup.lines)
      const receivedUpdateTrackGroupLinesIds = receivedUpdateTrackGroupLines.map((line) => line.id)
      allReceivedUpdateTrackGroupLinesIds = [
        ...allReceivedUpdateTrackGroupLinesIds,
        ...receivedUpdateTrackGroupLinesIds,
      ]
    }
    const allReceivedUpdateTrackGroupLines = await this.trackGroupLineCrud.getTrackGroupsLinesListByIds(
      allReceivedUpdateTrackGroupLinesIds,
      ['video', 'article', 'recipe'],
    )
    this.validateTrackGroupsLines(allReceivedUpdateTrackGroupLinesIds, allReceivedUpdateTrackGroupLines)

    return this.mapById(allReceivedUpdateTrackGroupLines)
  }

  validateTrackGroupsLines(trackGroupsLinesIds: string[], trackGroupsLines: TrackGroupLineEntity[]) {
    if (trackGroupsLinesIds.length !== trackGroupsLines.length) {
      const existTrackGroupsLinesIds = trackGroupsLines.map((line) => line.id)
      const notExistTrackGroupsLinesIds = existTrackGroupsLinesIds.filter(
        (lineId) => !existTrackGroupsLinesIds.includes(lineId),
      )
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedSomeEntitiesNotFound,
        HttpStatus.BAD_REQUEST,
        { field: 'groups.lines.id', ids: notExistTrackGroupsLinesIds },
      )
    }
  }

  async getReceivedGalleryRelationsMap(patchTrackGroups: PatchTrackGroupDto[]): Promise<{
    videos: { [key: string]: GalleryVideoEntity }
    articles: { [key: string]: GalleryArticleEntity }
    recipes: { [key: string]: GalleryRecipeEntity }
  }> {
    const relatedGalleryVideosIds = []
    const relatedGalleryArticlesIds = []
    const relatedGalleryRecipesIds = []
    for (const trackGroup of patchTrackGroups) {
      for (const trackGroupLine of trackGroup.lines) {
        if (trackGroupLine.video) {
          relatedGalleryVideosIds.push(trackGroupLine.video)
        }
        if (trackGroupLine.article) {
          relatedGalleryArticlesIds.push(trackGroupLine.article)
        }
        if (trackGroupLine.recipe) {
          relatedGalleryRecipesIds.push(trackGroupLine.recipe)
        }
      }
    }

    const relatedGalleryVideos = await this.galleryVideoCrud.getGalleryVideosByIds(relatedGalleryVideosIds)
    this.validateGalleryItems('video', relatedGalleryVideosIds, relatedGalleryVideos)
    const relatedGalleryArticles = await this.galleryArticleCrud.getGalleryArticlesByIds(relatedGalleryArticlesIds)
    this.validateGalleryItems('article', relatedGalleryArticlesIds, relatedGalleryArticles)
    const relatedGalleryRecipes = await this.galleryRecipeCrud.getGalleryRecipesByIds(relatedGalleryRecipesIds)
    this.validateGalleryItems('recipe', relatedGalleryRecipesIds, relatedGalleryRecipes)

    return {
      videos: this.mapById(relatedGalleryVideos),
      articles: this.mapById(relatedGalleryArticles),
      recipes: this.mapById(relatedGalleryRecipes),
    }
  }

  validateGalleryItems(
    propertyName: string,
    givenGalleryItemsIds: string[],
    existedGalleryItems: Array<GalleryVideoEntity | GalleryArticleEntity | GalleryRecipeEntity>,
  ) {
    const preparedGivenGalleryItemsIds = Array.from(new Set(givenGalleryItemsIds))
    const unpublishedGalleryItems = existedGalleryItems.filter((galleryItem) => !galleryItem.isPublished)
    if (unpublishedGalleryItems.length) {
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedSomeEntitiesUnpublished,
        HttpStatus.BAD_REQUEST,
        { field: propertyName, ids: unpublishedGalleryItems.map((galleryItem) => galleryItem.id) },
      )
    }
    if (preparedGivenGalleryItemsIds.length !== existedGalleryItems.length) {
      const existGalleryItemsIds = existedGalleryItems.map((galleryItem) => galleryItem.id)
      const notExistGalleryItemsIds = preparedGivenGalleryItemsIds.filter(
        (galleryItem) => !existGalleryItemsIds.includes(galleryItem),
      )
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedSomeEntitiesNotFound,
        HttpStatus.BAD_REQUEST,
        { field: propertyName, ids: notExistGalleryItemsIds },
      )
    }
  }

  prepareUpdateTrackGroupsLinesData(
    receivedTrackGroupLines: PatchTrackGroupLineDTO[],
    currentTrackGroupLinesMap: { [key: string]: TrackGroupLineEntity },
    relationGalleryItemsMaps,
  ): Array<Partial<TrackGroupLineEntity>> {
    const updateLinesData = []
    for (const receivedTrackGroupLine of this.getReceivedUpdateItems(receivedTrackGroupLines)) {
      const updateLineData = {}
      const currentLine = currentTrackGroupLinesMap[receivedTrackGroupLine.id]
      if (currentLine.order !== receivedTrackGroupLine.order) {
        updateLineData['order'] = receivedTrackGroupLine.order
      }
      if (currentLine?.video?.id !== receivedTrackGroupLine?.video) {
        updateLineData['video'] = relationGalleryItemsMaps['videos'][receivedTrackGroupLine.video]
      }
      if (currentLine?.article?.id !== receivedTrackGroupLine?.article) {
        updateLineData['article'] = relationGalleryItemsMaps['articles'][receivedTrackGroupLine.article]
      }
      if (currentLine?.recipe?.id !== receivedTrackGroupLine?.recipe) {
        updateLineData['recipe'] = relationGalleryItemsMaps['recipes'][receivedTrackGroupLine.recipe]
      }
      if (Object.keys(updateLineData).length) {
        updateLinesData.push({ ...updateLineData, ...{ id: receivedTrackGroupLine?.id } })
      }
    }

    return updateLinesData
  }

  prepareAddTrackGroupLinesData(
    givenTrackGroupLines: PatchTrackGroupLineDTO[],
    relationGalleryItemsMaps: {
      videos: { [key: string]: GalleryVideoEntity }
      articles: { [key: string]: GalleryArticleEntity }
      recipes: { [key: string]: GalleryRecipeEntity }
    },
    parentTrackGroup: TrackGroupEntity,
  ): Array<Omit<TrackGroupLineEntity, 'id' | 'createAt' | 'updateAt'>> {
    return this.getReceivedAddItems(givenTrackGroupLines).map((line) => {
      return {
        group: parentTrackGroup,
        order: line.order,
        video: line.video ? relationGalleryItemsMaps['videos'][line.video] : null,
        article: line.article ? relationGalleryItemsMaps['articles'][line.article] : null,
        recipe: line.recipe ? relationGalleryItemsMaps['recipes'][line.recipe] : null,
      }
    })
  }

  prepareRemoveTrackGroupLinesData(
    currentTrackGroupLines: TrackGroupLineEntity[],
    receivedTrackGroupLines: PatchTrackGroupLineDTO[],
  ): TrackGroupLineEntity[] {
    const receivedUpdateTrackGroupLines = this.getReceivedUpdateItems(receivedTrackGroupLines)
    const receivedUpdateTrackGroupLinesIds = receivedUpdateTrackGroupLines.map((line) => line.id)
    return currentTrackGroupLines.filter((line) => !receivedUpdateTrackGroupLinesIds.includes(line.id))
  }

  validateTargetGroups(targetGroupsIds: string[], targetGroups: TargetGroupEntity[]) {
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

  async prepareUpdateTrackRelationData(
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
}
