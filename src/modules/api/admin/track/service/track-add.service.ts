import { HttpStatus, Injectable } from '@nestjs/common'
import { TargetGroupCrud } from '../../../target-group/target-group.crud'
import { AddTrackDTO, AddTrackGroupDto } from '../dto/track-add.dto'
import { TargetGroupEntity } from '../../../../../database/entities/target-group.entity'
import { ValidationError } from '../../../../../core/errors/validation.error'
import { DictionaryErrorMessages } from '../../../../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../../../../constants/responses/codes.error.constants'
import { GalleryVideoCrud } from '../../gallery/crud/gallery-video.crud'
import { GalleryArticleCrud } from '../../gallery/crud/gallery-article.crud'
import { GalleryRecipeCrud } from '../../gallery/crud/gallery-recipe.crud'
import { GalleryVideoEntity } from '../../../../../database/entities/gallery-video.entity'
import { GalleryArticleEntity } from '../../../../../database/entities/gallery-article.entity'
import { GalleryRecipeEntity } from '../../../../../database/entities/gallery-recipe.entity'
import { TrackCrud } from '../crud/track.crud'
import { UserTracksService } from '../../../user-tracks/user-tracks.service'

@Injectable()
export class TrackAddService {
  constructor(
    private trackCrud: TrackCrud,
    private targetGroupCrud: TargetGroupCrud,
    private galleryVideoCrud: GalleryVideoCrud,
    private galleryArticleCrud: GalleryArticleCrud,
    private galleryRecipeCrud: GalleryRecipeCrud,
    private userTracksService: UserTracksService,
  ) {}

  async addTrack(addTrackDTO: AddTrackDTO) {
    const newTrack = {
      titleEn: addTrackDTO.titleEn,
      titleSp: addTrackDTO.titleSp,
      targetGroups: await this.prepareTargetGroups(addTrackDTO.targetGroups),
      groups: await this.prepareTrackGroups(addTrackDTO.groups),
      isPublished: addTrackDTO.isPublished,
    }

    const track = await this.trackCrud.save(newTrack)

    if (track.isPublished) {
      await this.userTracksService.assignTracksToUsersByTrackId(track.id)
    }

    return track
  }

  async prepareTargetGroups(targetGroupsIds: string[]) {
    const targetGroups = await this.targetGroupCrud.getTargetGroupsByIds(targetGroupsIds)
    this.validateTargetGroups(targetGroupsIds, targetGroups)

    return targetGroups
  }

  async prepareTrackGroups(addTrackGroupsDTO: AddTrackGroupDto[]) {
    const { galleryVideosMap, galleryArticlesMap, galleryRecipesMap } = await this.prepareGalleryRelations(
      addTrackGroupsDTO,
    )
    const newGroups = []
    for (const trackGroup of addTrackGroupsDTO) {
      const newGroup = {
        order: trackGroup.order,
        schedule: trackGroup.schedule,
        lines: [],
      }
      for (const trackGroupLine of trackGroup.lines) {
        const newLine = {
          order: trackGroupLine.order,
        }
        if (trackGroupLine.video) {
          newLine['video'] = galleryVideosMap[trackGroupLine.video]
        }
        if (trackGroupLine.article) {
          newLine['article'] = galleryArticlesMap[trackGroupLine.article]
        }
        if (trackGroupLine.recipe) {
          newLine['recipe'] = galleryRecipesMap[trackGroupLine.recipe]
        }
        newGroup.lines.push(newLine)
      }

      newGroups.push(newGroup)
    }

    return newGroups
  }

  async prepareGalleryRelations(addTrackGroupsDTO: AddTrackGroupDto[]) {
    const relatedGalleryVideosIds = []
    const relatedGalleryArticlesIds = []
    const relatedGalleryRecipesIds = []
    for (const trackGroup of addTrackGroupsDTO) {
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
    this.validateGalleryItem('video', relatedGalleryVideosIds, relatedGalleryVideos)
    const relatedGalleryArticles = await this.galleryArticleCrud.getGalleryArticlesByIds(relatedGalleryArticlesIds)
    this.validateGalleryItem('article', relatedGalleryArticlesIds, relatedGalleryArticles)
    const relatedGalleryRecipes = await this.galleryRecipeCrud.getGalleryRecipesByIds(relatedGalleryRecipesIds)
    this.validateGalleryItem('recipe', relatedGalleryRecipesIds, relatedGalleryRecipes)

    const mapById = (obj, item) => Object.assign(obj, { [item.id]: item })
    const relatedGalleryVideosMap = relatedGalleryVideos.reduce(mapById, {})
    const relatedGalleryArticlesMap = relatedGalleryArticles.reduce(mapById, {})
    const relatedGalleryRecipesMap = relatedGalleryRecipes.reduce(mapById, {})

    return {
      galleryVideosMap: relatedGalleryVideosMap,
      galleryArticlesMap: relatedGalleryArticlesMap,
      galleryRecipesMap: relatedGalleryRecipesMap,
    }
  }

  validateGalleryItem(
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
}
