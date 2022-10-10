import { HttpStatus, Injectable } from '@nestjs/common'
import {
  AddArticleDTO,
  AddRecipeDTO,
  AddVideoDTO,
  GalleryArticlesListingOptionsDTO,
  GalleryRecipesListingOptionsDTO,
  GallerySearchResponseDTO,
  GalleryVideosListingOptionsDTO,
  GetGalleryArticleResponseDTO,
  GetGalleryRecipeResponseDTO,
  GetGalleryVideoResponseDTO,
  PatchArticleDTO,
  PatchRecipeDTO,
  PatchVideoDTO,
  SearchOptionsDTO,
} from './gallery.dto'
import { StorageEntityService } from '../storage/storage-entity.service'
import { StorageContentTypes } from '../../../../constants/enums/storage.constants'
import { StorageEntity } from '../../../../database/entities/storage.entity'
import { ConditionsEntity } from '../../../../database/entities/conditions.entity'
import { ConditionsCrudService } from '../../conditions/conditions.crud'
import { ValidationError } from '../../../../core/errors/validation.error'
import { DictionaryErrorMessages } from '../../../../constants/responses/messages.error.constants'
import { ErrorCodes } from '../../../../constants/responses/codes.error.constants'
import { GalleryVideoCrud } from './crud/gallery-video.crud'
import { GalleryArticleCrud } from './crud/gallery-article.crud'
import { GalleryRecipeCrud } from './crud/gallery-recipe.crud'
import { TriggersCrudService } from '../../triggers/triggers.crud'
import { MedicationsCrudService } from '../../medications/medications.crud'
import { MedicationsEntity } from '../../../../database/entities/medications.entity'
import { TriggersEntity } from '../../../../database/entities/triggers.entity'
import {
  galleryArticlesImagePresignedLinkExpires,
  galleryRecipeImagePresignedLinkExpires,
  GalleryTypes,
  galleryVideoPreviewPresignLinkExpires,
} from '../../../../constants/enums/gallery.constants'
import { GalleryVideoEntity } from '../../../../database/entities/gallery-video.entity'
import { PageDTO, PageMetaDTO } from '../../../../core/dtos/pagination'
import { GalleryArticleEntity } from '../../../../database/entities/gallery-article.entity'
import { GalleryRecipeEntity } from '../../../../database/entities/gallery-recipe.entity'
import { NotFoundError } from '../../../../core/errors/not-found.error'
import { BaseEntity } from '../../../../database/base-entities/base.entity'
import { S3Service } from '../../../../integrations/s3/s3.service'

@Injectable()
export class GalleryService {
  constructor(
    private galleryVideoCrud: GalleryVideoCrud,
    private galleryArticleCrud: GalleryArticleCrud,
    private galleryRecipeCrud: GalleryRecipeCrud,
    private storageEntityService: StorageEntityService,
    private conditionsCrudService: ConditionsCrudService,
    private triggersCrudService: TriggersCrudService,
    private medicationsCrudService: MedicationsCrudService,
    private s3Service: S3Service,
  ) {}

  async addVideo(addVideoDTO: AddVideoDTO) {
    const video = await this.storageEntityService.getStorageItemById(addVideoDTO.videoId)
    this.validateVideo(video, 'videoId')
    const videoPreview = await this.storageEntityService.getStorageItemById(addVideoDTO.videoPreviewId)
    this.validateImage(videoPreview, 'videoPreviewId')
    const conditions = await this.conditionsCrudService.getConditionsByIds(addVideoDTO.conditions)
    this.validateConditions(addVideoDTO.conditions, conditions)
    const medications = await this.medicationsCrudService.getMedicationsByProductIds(addVideoDTO.medications)
    this.validateMedications(addVideoDTO.medications, medications)
    const triggers = await this.triggersCrudService.getTriggersByIds(addVideoDTO.triggers)
    this.validateTriggers(addVideoDTO.triggers, triggers)

    if (!video.isPosted) {
      await this.storageEntityService.updateStorageItem(video, { isPosted: true })
      video.isPosted = true
    }
    if (!videoPreview.isPosted) {
      await this.storageEntityService.updateStorageItem(videoPreview, { isPosted: true })
      videoPreview.isPosted = true
    }

    return this.galleryVideoCrud.save({
      type: addVideoDTO.type,
      video: video,
      videoPreview: videoPreview,
      titleEn: addVideoDTO.titleEn,
      titleSp: addVideoDTO.titleSp,
      keywordsEn: addVideoDTO.keywordsEn,
      keywordsSp: addVideoDTO.keywordsSp,
      descriptionEn: addVideoDTO.descriptionEn,
      descriptionSp: addVideoDTO.descriptionSp,
      isPublished: addVideoDTO.isPublished,
      conditions: conditions,
      medications: medications,
      triggers: triggers,
    })
  }

  async addArticle(addArticleDTO: AddArticleDTO) {
    const image = await this.storageEntityService.getStorageItemById(addArticleDTO.imageId)
    this.validateImage(image, 'imageId')
    const conditions = await this.conditionsCrudService.getConditionsByIds(addArticleDTO.conditions)
    this.validateConditions(addArticleDTO.conditions, conditions)
    const medications = await this.medicationsCrudService.getMedicationsByProductIds(addArticleDTO.medications)
    this.validateMedications(addArticleDTO.medications, medications)
    const triggers = await this.triggersCrudService.getTriggersByIds(addArticleDTO.triggers)
    this.validateTriggers(addArticleDTO.triggers, triggers)

    if (!image.isPosted) {
      await this.storageEntityService.updateStorageItem(image, { isPosted: true })
      image.isPosted = true
    }

    return this.galleryArticleCrud.save({
      image: image,
      titleEn: addArticleDTO.titleEn,
      titleSp: addArticleDTO.titleSp,
      summaryEn: addArticleDTO.summaryEn,
      summarySp: addArticleDTO.summarySp,
      keywordsEn: addArticleDTO.keywordsEn,
      keywordsSp: addArticleDTO.keywordsSp,
      textEn: addArticleDTO.textEn,
      textSp: addArticleDTO.textSp,
      isPublished: addArticleDTO.isPublished,
      conditions: conditions,
      medications: medications,
      triggers: triggers,
    })
  }

  async addRecipe(addRecipeDTO: AddRecipeDTO) {
    const image = await this.storageEntityService.getStorageItemById(addRecipeDTO.imageId)
    this.validateImage(image, 'imageId')

    if (!image.isPosted) {
      await this.storageEntityService.updateStorageItem(image, { isPosted: true })
      image.isPosted = true
    }

    return this.galleryRecipeCrud.save({
      image: image,
      titleEn: addRecipeDTO.titleEn,
      titleSp: addRecipeDTO.titleSp,
      summaryEn: addRecipeDTO.summaryEn,
      summarySp: addRecipeDTO.summarySp,
      keywordsEn: addRecipeDTO.keywordsEn,
      keywordsSp: addRecipeDTO.keywordsSp,
      textEn: addRecipeDTO.textEn,
      textSp: addRecipeDTO.textSp,
      isPublished: addRecipeDTO.isPublished,
    })
  }

  async searchGalleryAssets(searchOptionsDTO: SearchOptionsDTO) {
    const result: GallerySearchResponseDTO = {
      articles: [],
      videos: [],
      recipes: [],
    }

    if (searchOptionsDTO.type === GalleryTypes.video || !searchOptionsDTO.type) {
      const galleryVideos = await this.galleryVideoCrud.searchByParams(
        searchOptionsDTO.search,
        searchOptionsDTO.isPublished,
      )
      result['videos'] = await this.applyPresignedLinks(
        galleryVideos,
        'videoPreview',
        galleryVideoPreviewPresignLinkExpires,
      )
    }
    if (searchOptionsDTO.type === GalleryTypes.article || !searchOptionsDTO.type) {
      const galleryArticles = await this.galleryArticleCrud.searchByParams(
        searchOptionsDTO.search,
        searchOptionsDTO.isPublished,
      )
      result['articles'] = await this.applyPresignedLinks(
        galleryArticles,
        'image',
        galleryArticlesImagePresignedLinkExpires,
      )
    }
    if (searchOptionsDTO.type === GalleryTypes.recipe || !searchOptionsDTO.type) {
      const galleryRecipes = await this.galleryRecipeCrud.searchByParams(
        searchOptionsDTO.search,
        searchOptionsDTO.isPublished,
      )
      result['recipes'] = await this.applyPresignedLinks(
        galleryRecipes,
        'image',
        galleryRecipeImagePresignedLinkExpires,
      )
    }

    return result
  }

  async applyPresignedLinks<T>(
    galleryItems: T[],
    imageField: string,
    expires: number,
  ): Promise<Array<T & { previewImagePresignedLink: string | null }>> {
    const linksPromises = galleryItems.map((galleryItem) =>
      galleryItem[imageField]
        ? this.s3Service.getPresignedLink(
            galleryItem[imageField].bucketKey,
            galleryItem[imageField].bucketName,
            expires,
          )
        : null,
    )
    const presignedLinksPromisesResult = await Promise.all(linksPromises)

    return galleryItems.map((galleryItem, index) =>
      Object.assign(galleryItem, { previewImagePresignedLink: presignedLinksPromisesResult[index] }),
    )
  }

  async getGalleryVideos(options: GalleryVideosListingOptionsDTO): Promise<PageDTO<GetGalleryVideoResponseDTO>> {
    const { entities, totalCount } = await this.galleryVideoCrud.getItemsByFilterParams(options)

    const preparedEntities = await this.applyPresignedLinks(
      entities,
      'videoPreview',
      galleryVideoPreviewPresignLinkExpires,
    )
    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: options, itemCount: totalCount })

    return new PageDTO(preparedEntities, pageMetaDto)
  }

  async getGalleryArticles(options: GalleryArticlesListingOptionsDTO): Promise<PageDTO<GetGalleryArticleResponseDTO>> {
    const { entities, totalCount } = await this.galleryArticleCrud.getItemsByFilterParams(options)
    const preparedEntities = await this.applyPresignedLinks(entities, 'image', galleryArticlesImagePresignedLinkExpires)
    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: options, itemCount: totalCount })

    return new PageDTO(preparedEntities, pageMetaDto)
  }

  async getGalleryRecipes(options: GalleryRecipesListingOptionsDTO): Promise<PageDTO<GetGalleryRecipeResponseDTO>> {
    const { entities, totalCount } = await this.galleryRecipeCrud.getItemsByFilterParams(options)
    const preparedEntities = await this.applyPresignedLinks(entities, 'image', galleryRecipeImagePresignedLinkExpires)
    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: options, itemCount: totalCount })

    return new PageDTO(preparedEntities, pageMetaDto)
  }

  async patchGalleryVideo(galleryVideoId: string, patchVideoDTO: PatchVideoDTO) {
    const galleryVideoRelations = ['video', 'videoPreview', 'conditions', 'medications', 'triggers']
    const galleryVideo = await this.galleryVideoCrud.getGalleryVideoById(galleryVideoId, galleryVideoRelations)
    if (!galleryVideo) {
      throw new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND)
    }

    const updateData = this.prepareSimplePatchParams(galleryVideo, patchVideoDTO, [
      'titleEn',
      'titleSp',
      'keywordsEn',
      'keywordsSp',
      'descriptionEn',
      'descriptionSp',
      'isPublished',
    ])

    if (patchVideoDTO.videoId !== undefined && galleryVideo.video.id !== patchVideoDTO.videoId) {
      const newVideo = await this.storageEntityService.getStorageItemById(patchVideoDTO.videoId)
      this.validateVideo(newVideo, 'videoId')
      if (!newVideo.isPosted) {
        await this.storageEntityService.updateStorageItem(newVideo, { isPosted: true })
      }
      const isOldVideoPosted = await this.galleryVideoCrud.areThereVideosThatUseVideo(galleryVideo.video, galleryVideo)
      if (!isOldVideoPosted) {
        await this.storageEntityService.updateStorageItem(galleryVideo.video, { isPosted: false })
      }
      updateData['video'] = newVideo
    }

    if (patchVideoDTO.videoPreviewId !== undefined && galleryVideo.videoPreview.id !== patchVideoDTO.videoPreviewId) {
      const newVideoPreview = await this.storageEntityService.getStorageItemById(patchVideoDTO.videoPreviewId)
      this.validateImage(newVideoPreview, 'videoPreviewId')
      if (!newVideoPreview.isPosted) {
        await this.storageEntityService.updateStorageItem(newVideoPreview, { isPosted: true })
      }
      if (!(await this.isAttachedImagePosted(galleryVideo, 'videoPreview'))) {
        await this.storageEntityService.updateStorageItem(galleryVideo.videoPreview, { isPosted: false })
      }
      updateData['videoPreview'] = newVideoPreview
    }

    const updateRelationsData = {}
    if (patchVideoDTO.conditions !== undefined) {
      const updateParams = await this.prepareRelationPatchParam(
        patchVideoDTO.conditions,
        galleryVideo.conditions,
        (ids) => this.conditionsCrudService.getConditionsByIds(ids),
        this.validateConditions,
      )
      if (updateParams) {
        updateRelationsData['conditions'] = updateParams
      }
    }
    if (patchVideoDTO.medications !== undefined) {
      const updateParams = await this.prepareRelationPatchParam(
        patchVideoDTO.medications,
        galleryVideo.medications,
        (ids) => this.medicationsCrudService.getMedicationsByProductIds(ids),
        this.validateMedications,
        'productId',
      )
      if (updateParams) {
        updateRelationsData['medications'] = updateParams
      }
    }
    if (patchVideoDTO.triggers !== undefined) {
      const updateParams = await this.prepareRelationPatchParam(
        patchVideoDTO.triggers,
        galleryVideo.triggers,
        (ids) => this.triggersCrudService.getTriggersByIds(ids),
        this.validateTriggers,
      )
      if (updateParams) {
        updateRelationsData['triggers'] = updateParams
      }
    }

    await this.galleryVideoCrud.update(galleryVideo, updateData, updateRelationsData)
    return await this.galleryVideoCrud.getGalleryVideoById(galleryVideoId, galleryVideoRelations)
  }

  async patchGalleryArticle(galleryArticleId: string, patchArticleDTO: PatchArticleDTO) {
    const galleryArticleRelations = ['image', 'conditions', 'medications', 'triggers']
    const galleryArticle = await this.galleryArticleCrud.getGalleryArticleById(
      galleryArticleId,
      galleryArticleRelations,
    )
    if (!galleryArticle) {
      throw new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND)
    }

    const updateData = this.prepareSimplePatchParams(galleryArticle, patchArticleDTO, [
      'titleEn',
      'titleSp',
      'summaryEn',
      'summarySp',
      'keywordsEn',
      'keywordsSp',
      'textEn',
      'textSp',
      'isPublished',
    ])
    if (patchArticleDTO.imageId !== undefined && galleryArticle.image.id !== patchArticleDTO.imageId) {
      const newImage = await this.storageEntityService.getStorageItemById(patchArticleDTO.imageId)
      this.validateImage(newImage, 'imageId')
      if (!newImage.isPosted) {
        await this.storageEntityService.updateStorageItem(newImage, { isPosted: true })
      }
      if (!(await this.isAttachedImagePosted(galleryArticle, 'image'))) {
        await this.storageEntityService.updateStorageItem(galleryArticle.image, { isPosted: false })
      }
      updateData['image'] = newImage
    }

    const updateRelationsData = {}
    if (patchArticleDTO.conditions !== undefined) {
      const updateParams = await this.prepareRelationPatchParam(
        patchArticleDTO.conditions,
        galleryArticle.conditions,
        (ids) => this.conditionsCrudService.getConditionsByIds(ids),
        this.validateConditions,
      )
      if (updateParams) {
        updateRelationsData['conditions'] = updateParams
      }
    }
    if (patchArticleDTO.medications !== undefined) {
      const updateParams = await this.prepareRelationPatchParam(
        patchArticleDTO.medications,
        galleryArticle.medications,
        (ids) => this.medicationsCrudService.getMedicationsByProductIds(ids),
        this.validateMedications,
        'productId',
      )
      if (updateParams) {
        updateRelationsData['medications'] = updateParams
      }
    }
    if (patchArticleDTO.triggers !== undefined) {
      const updateParams = await this.prepareRelationPatchParam(
        patchArticleDTO.triggers,
        galleryArticle.triggers,
        (ids) => this.triggersCrudService.getTriggersByIds(ids),
        this.validateTriggers,
      )
      if (updateParams) {
        updateRelationsData['triggers'] = updateParams
      }
    }

    await this.galleryArticleCrud.update(galleryArticle, updateData, updateRelationsData)
    return await this.galleryArticleCrud.getGalleryArticleById(galleryArticleId, galleryArticleRelations)
  }

  async patchGalleryRecipe(galleryRecipeId: string, patchRecipeDTO: PatchRecipeDTO) {
    const galleryRecipeRelations = ['image']
    const galleryRecipe = await this.galleryRecipeCrud.getGalleryRecipeById(galleryRecipeId, galleryRecipeRelations)
    if (!galleryRecipe) {
      throw new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND)
    }

    const updateData = this.prepareSimplePatchParams(galleryRecipe, patchRecipeDTO, [
      'titleEn',
      'titleSp',
      'summaryEn',
      'summarySp',
      'keywordsEn',
      'keywordsSp',
      'textEn',
      'textSp',
      'isPublished',
    ])

    if (patchRecipeDTO.imageId !== undefined && galleryRecipe.image.id !== patchRecipeDTO.imageId) {
      const newImage = await this.storageEntityService.getStorageItemById(patchRecipeDTO.imageId)
      this.validateImage(newImage, 'imageId')
      if (!newImage.isPosted) {
        await this.storageEntityService.updateStorageItem(newImage, { isPosted: true })
      }
      if (!(await this.isAttachedImagePosted(galleryRecipe, 'image'))) {
        await this.storageEntityService.updateStorageItem(galleryRecipe.image, { isPosted: false })
      }
      updateData['image'] = newImage
    }

    await this.galleryRecipeCrud.update(galleryRecipe, updateData)
    return await this.galleryRecipeCrud.getGalleryRecipeById(galleryRecipeId, galleryRecipeRelations)
  }

  async isAttachedImagePosted(
    galleryItem: GalleryRecipeEntity | GalleryVideoEntity | GalleryArticleEntity,
    imageFieldName: string,
  ): Promise<boolean> {
    const thereAreArticles = await this.galleryArticleCrud.areThereArticlesThatUseImage(
      galleryItem[imageFieldName],
      galleryItem instanceof GalleryArticleEntity ? galleryItem : null,
    )
    const thereAreRecipes = await this.galleryRecipeCrud.areThereRecipesThatUseImage(
      galleryItem[imageFieldName],
      galleryItem instanceof GalleryRecipeEntity ? galleryItem : null,
    )
    const thereAreVideos = await this.galleryVideoCrud.areThereVideosThatUseVideoPreview(
      galleryItem[imageFieldName],
      galleryItem instanceof GalleryVideoEntity ? galleryItem : null,
    )
    return thereAreArticles || thereAreRecipes || thereAreVideos
  }

  async deleteGalleryVideo(galleryVideoId: string): Promise<void> {
    const galleryVideo = await this.galleryVideoCrud.getGalleryVideoById(galleryVideoId, ['video', 'videoPreview'])
    if (!galleryVideo) {
      throw new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND)
    }
    if (!(await this.isAttachedImagePosted(galleryVideo, 'videoPreview'))) {
      await this.storageEntityService.updateStorageItem(galleryVideo.videoPreview, { isPosted: false })
    }

    const isVideoPosted = await this.galleryVideoCrud.areThereVideosThatUseVideo(galleryVideo.video, galleryVideo)
    if (!isVideoPosted) {
      await this.storageEntityService.updateStorageItem(galleryVideo.video, { isPosted: false })
    }

    await this.galleryVideoCrud.removeGalleryVideo(galleryVideo)
  }

  async deleteGalleryArticle(galleryArticleId: string): Promise<void> {
    const galleryArticle = await this.galleryArticleCrud.getGalleryArticleById(galleryArticleId, ['image'])
    if (!galleryArticle) {
      throw new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND)
    }
    if (!(await this.isAttachedImagePosted(galleryArticle, 'image'))) {
      await this.storageEntityService.updateStorageItem(galleryArticle.image, { isPosted: false })
    }

    await this.galleryArticleCrud.removeGalleryArticle(galleryArticle)
  }

  async deleteGalleryRecipe(galleryRecipeId: string): Promise<void> {
    const galleryRecipe = await this.galleryRecipeCrud.getGalleryRecipeById(galleryRecipeId, ['image'])
    if (!galleryRecipe) {
      throw new NotFoundError(DictionaryErrorMessages.EntityNotFound, ErrorCodes.EntityNotFound, HttpStatus.NOT_FOUND)
    }
    if (!(await this.isAttachedImagePosted(galleryRecipe, 'image'))) {
      await this.storageEntityService.updateStorageItem(galleryRecipe.image, { isPosted: false })
    }

    await this.galleryRecipeCrud.removeGalleryRecipe(galleryRecipe)
  }

  prepareSimplePatchParams(
    entity: GalleryVideoEntity | GalleryArticleEntity | GalleryRecipeEntity,
    patchDTO: PatchVideoDTO | PatchArticleDTO | PatchRecipeDTO,
    fields: Array<keyof GalleryVideoEntity | keyof GalleryArticleEntity | keyof GalleryRecipeEntity>,
  ) {
    const result = {}
    for (const field of fields) {
      if (patchDTO.hasOwnProperty(field) && patchDTO[field] !== undefined && entity[field] !== patchDTO[field]) {
        result[field] = patchDTO[field]
      }
    }

    return result
  }

  async prepareRelationPatchParam(
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

  validateConditions(conditionsIds: string[], conditions: ConditionsEntity[]) {
    if (conditionsIds.length !== conditions.length) {
      const existConditionsIds = conditions.map((condition: ConditionsEntity) => condition.id)
      const notExistConditionsIds = conditionsIds.filter((conditionId) => !existConditionsIds.includes(conditionId))
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedSomeEntitiesNotFound,
        HttpStatus.BAD_REQUEST,
        { field: 'conditions', ids: notExistConditionsIds },
      )
    }
  }

  validateMedications(medicationsProductIds: string[], medications: MedicationsEntity[]) {
    if (medicationsProductIds.length !== medications.length) {
      const existMedicationsProductIds = medications.map((medication: MedicationsEntity) => medication.productId)
      const notExistMedicationsProductIds = medicationsProductIds.filter(
        (medicationId) => !existMedicationsProductIds.includes(medicationId),
      )
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedSomeEntitiesNotFound,
        HttpStatus.BAD_REQUEST,
        { field: 'medications', ids: notExistMedicationsProductIds },
      )
    }
  }

  validateTriggers(triggersIds: string[], triggers: TriggersEntity[]) {
    if (triggersIds.length !== triggers.length) {
      const existTriggersIds = triggers.map((trigger: TriggersEntity) => trigger.id)
      const notExistTriggersIds = triggersIds.filter((triggerId) => !existTriggersIds.includes(triggerId))
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedSomeEntitiesNotFound,
        HttpStatus.BAD_REQUEST,
        { field: 'triggers', ids: notExistTriggersIds },
      )
    }
  }

  validateVideo(video: StorageEntity | null, fieldName: string) {
    if (!video) {
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedRelatedEntityNotFound,
        HttpStatus.BAD_REQUEST,
        { field: fieldName },
      )
    }
    if (video.contentType !== StorageContentTypes.video) {
      throw new ValidationError(
        DictionaryErrorMessages.ValidationFailed,
        ErrorCodes.ValidationFailedInvalidStorageItemType,
        HttpStatus.BAD_REQUEST,
        { field: fieldName },
      )
    }
  }

  validateImage(image: StorageEntity | null, fieldName: string) {
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
}
