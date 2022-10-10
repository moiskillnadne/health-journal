import { UserRecipesEntity } from './../../../database/entities/user-recipes.entity'
import { UserArticlesEntity } from './../../../database/entities/user-articles.entity'
import { UserVideosEntity } from './../../../database/entities/user-videos.entity'
import { BadRequestError } from './../../../core/errors/bad-request.error'
import { HttpStatus, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import dataSource from '../../../database/database.config'

import { PageDTO, PageMetaDTO } from '../../../core/dtos/pagination'
import { defaultOrderField, Order } from '../../../constants/enums/pagination.constants'
import {
  galleryArticlesImagePresignedLinkExpires,
  galleryVideoPreviewPresignLinkExpires,
  galleryVideoSourcePresignedLinkExpires,
} from '../../../constants/enums/gallery.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { Language } from '../../../constants/language'
import { NotFoundError } from '../../../core/errors/not-found.error'
import internal from 'stream'
import { S3Service } from '../../../integrations/s3/s3.service'
import { StorageListingOptionsDTO } from '../admin/storage/storage.dto'

import { GalleryVideoEntity } from '../../../database/entities/gallery-video.entity'

import { GalleryVideosGrudService } from './cruds/gallery-video.crud'
import { GalleryArticleCrudService } from './cruds/gallery-articles.crud'
import { GalleryRecipeCrudService } from './cruds/gallery-recipe.crud'

import {
  GalleryArticleLocalizedResponseDTO,
  GalleryArticleResponseDTO,
  GalleryRecipeLocalizedResponseDTO,
  GalleryRecipeResponseDTO,
  GallerySingleArticleResponseDTO,
  GallerySingleVideoResponseDTO,
  GalleryVideoListResponseDTO,
} from './dto/gallery.response.dto'
import { UserArticlesCrudService } from '../user-articles/user-articles.crud'
import { IBaseResponse } from '../../../models/response.models'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { UserRecipesCrudService } from '../user-recipes/user-recipes.crud'
import { PatchUserArticleStatusOptionalParamsDto, PatchUserVideoStatusParamsDto } from './dto/gallery.dto'
import { UserVideosCrudService } from '../user-videos/user-videos.crud'
import { StorageService } from '../storage/storage.service'

@Injectable()
export class GalleryService {
  constructor(
    private galleryVideoCrud: GalleryVideosGrudService,
    private galleryArticleCrud: GalleryArticleCrudService,
    private galleryRecipeCrud: GalleryRecipeCrudService,
    private s3Service: S3Service,
    private userArticlesCrudService: UserArticlesCrudService,
    private userRecipesCrudService: UserRecipesCrudService,
    private userVideosCrudService: UserVideosCrudService,
    private storageService: StorageService,
  ) {}

  public async getStreamVideo(
    videoId: string,
    i18n: I18nContext,
    range: string,
  ): Promise<{ stream: internal.Readable; headers: Record<string, unknown> }> {
    const galleryVideo = await this.galleryVideoCrud.getVideoById(videoId)

    if (!galleryVideo) {
      throw new NotFoundError(
        i18n.t(DictionaryPathToken.GalleryVideoNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    const { bucketKey, bucketName, size } = galleryVideo.video

    const parts = range?.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : size - 1
    const CHUNK_SIZE = end - start + 1

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': CHUNK_SIZE,
      'Content-Type': 'video/mp4',
    }

    return {
      stream: this.s3Service.getPureStreamFile(bucketKey, bucketName, `bytes=${start}-${end}`),
      headers,
    }
  }

  public async getGalleryVideos(
    userId: string,
    filterParams: StorageListingOptionsDTO,
    i18n: I18nContext,
  ): Promise<PageDTO<GalleryVideoListResponseDTO>> {
    const galleryVideoListResponse = await this.galleryVideoCrud.getVideos(filterParams)

    const { data: videoList } = galleryVideoListResponse

    const userVideosMeta = await this.userVideosCrudService.findManyByUserIdWithParams(userId, {})

    const getPresignedLinkPromises = videoList.map((video) =>
      this.s3Service.getPresignedLink(
        video.videoPreview.bucketKey,
        video.videoPreview.bucketName,
        galleryVideoPreviewPresignLinkExpires,
      ),
    )

    const videoPreviewPresingedLinks = await Promise.allSettled(getPresignedLinkPromises)

    const localizedVideoList = this.localizeVideoList(videoList, userVideosMeta, i18n.lang)

    const videoPreviewPresignedLink = localizedVideoList.map((video, index) => {
      const presignedPreviewPromiseResponse = videoPreviewPresingedLinks[index]

      return { ...video, sourceUrl: presignedPreviewPromiseResponse['value'] }
    })

    return new PageDTO(videoPreviewPresignedLink, galleryVideoListResponse.meta)
  }

  public async getGalleryVideoById(
    videoId: string,
    userId: string,
    i18n: I18nContext,
  ): Promise<GallerySingleVideoResponseDTO> {
    const galleryVideo = await this.galleryVideoCrud.getVideoById(videoId)

    if (!galleryVideo) {
      throw new NotFoundError(
        i18n.t(DictionaryPathToken.GalleryVideoNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    const userVideoData = await this.userVideosCrudService.findByVideoIdAndUserIdOrCreate(userId, galleryVideo.id, {
      isVisited: true,
    })

    if (!userVideoData) {
      throw new NotFoundError(
        i18n.t(DictionaryPathToken.GalleryVideoNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    const { video } = galleryVideo

    const presignedSourceVideoUrl = await this.s3Service.getPresignedLink(
      video.bucketKey,
      video.bucketName,
      galleryVideoSourcePresignedLinkExpires,
    )

    const isEnglish = i18n.lang === Language.English.toLocaleLowerCase()

    return {
      id: galleryVideo.id,
      createAt: galleryVideo.createAt,
      sourceUrl: presignedSourceVideoUrl,
      title: isEnglish ? galleryVideo.titleEn : galleryVideo.titleSp,
      description: isEnglish ? galleryVideo.descriptionEn : galleryVideo.descriptionSp,
      isFavorite: userVideoData?.isFavorite,
      isVisited: userVideoData?.isVisited,
      isViewed: userVideoData?.isViewed,
    }
  }

  async getGalleryArticlesAndRecipesRecordsWithPaginationByParams(
    params: StorageListingOptionsDTO,
  ): Promise<PageDTO<GalleryArticleResponseDTO | GalleryRecipeResponseDTO>> {
    const articleQuery = this.galleryArticleCrud.getArticleQueryByParams(params)
    const recipeQuery = this.galleryRecipeCrud.getRecipeQueryByParams(params)

    const [count, data] = await Promise.all([
      dataSource.manager.query(`SELECT COUNT(*) FROM (${articleQuery} UNION ${recipeQuery}) AS count`),
      dataSource.manager.query(
        `${articleQuery} UNION ${recipeQuery}
      ORDER BY "${defaultOrderField}" ${Order.DESC}
      OFFSET ${(params.page - 1) * params.take}
      LIMIT ${params.take}`,
      ),
    ])

    return new PageDTO(data, new PageMetaDTO({ paginationOptionsDto: params, itemCount: Number(count[0].count) }))
  }

  public async getUserArticlesAndUserRecipes(userId: string): Promise<Array<UserArticlesEntity | UserRecipesEntity>> {
    const [userArticles, userRecipes] = await Promise.all([
      this.userArticlesCrudService.findManyByUserIdWithParams(userId),
      this.userRecipesCrudService.findManyByUserIdWithParams(userId),
    ])

    return [...userArticles, ...userRecipes]
  }

  public async getGalleryArticlesAndRecipesByParams(
    userId: string,
    params: StorageListingOptionsDTO,
    i18n: I18nContext,
  ): Promise<PageDTO<GalleryArticleLocalizedResponseDTO | GalleryRecipeLocalizedResponseDTO>> {
    const { data, meta } = await this.getGalleryArticlesAndRecipesRecordsWithPaginationByParams(params)

    const userRecords = await this.getUserArticlesAndUserRecipes(userId)

    const presignedLinkPromises = data.map((item) =>
      this.s3Service.getPresignedLink(item.bucketKey, item.bucketName, galleryArticlesImagePresignedLinkExpires),
    )

    const links = await Promise.allSettled(presignedLinkPromises)

    const localized = this.localizeArticleList(data, userRecords, i18n.lang)

    const list = localized.map((article, index) => {
      return { ...article, sourceUrl: links[index]['value'] }
    })

    return new PageDTO(list, meta)
  }

  public async patchUserArticleStatus(
    userId: string,
    articleId: string,
    params: PatchUserArticleStatusOptionalParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const galleryArticle = await this.galleryArticleCrud.getArticleById(articleId)

    if (!galleryArticle) {
      throw new NotFoundError(
        i18n.t(DictionaryPathToken.GalleryArticleNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    const userArticle = await this.userArticlesCrudService.findByArticleIdAndUserIdOrCreate(userId, articleId)

    const updateResult = await this.userArticlesCrudService.updateById(userArticle.id, params)

    return {
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
      code: SuccessCodes.WellnessJourneyItemUpdated,
      httpCode: HttpStatus.OK,
      details: { ...updateResult },
    }
  }

  public async patchUserRecipeStatus(
    userId: string,
    recipeId: string,
    params: PatchUserArticleStatusOptionalParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const galleryRecipe = await this.galleryRecipeCrud.getRecipeById(recipeId)

    if (!galleryRecipe) {
      throw new NotFoundError(
        i18n.t(DictionaryPathToken.GalleryArticleNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    const userRecipe = await this.userRecipesCrudService.findByRecipeIdAndUserIdOrCreate(userId, recipeId)

    const updateResult = await this.userRecipesCrudService.updateById(userRecipe.id, params)

    return {
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
      code: SuccessCodes.WellnessJourneyItemUpdated,
      httpCode: HttpStatus.OK,
      details: { ...updateResult },
    }
  }

  public async getGalleryArticleOrRecipeById(
    id: string,
    userId: string,
    i18n: I18nContext,
  ): Promise<GallerySingleArticleResponseDTO> {
    const [article, recipe] = await Promise.all([
      this.galleryArticleCrud.getArticleById(id),
      this.galleryRecipeCrud.getRecipeById(id),
    ])

    if (!article && !recipe) {
      throw new NotFoundError(
        i18n.t(DictionaryPathToken.GalleryArticleNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    const record = (article || recipe) as GalleryArticleResponseDTO | GalleryRecipeResponseDTO

    let userRecord: UserArticlesEntity | UserRecipesEntity | undefined

    if (article && !recipe) {
      userRecord = await this.userArticlesCrudService.findByArticleIdAndUserIdOrCreate(userId, article.id, {
        isVisited: true,
      })
    } else if (!article && recipe) {
      userRecord = await this.userRecipesCrudService.findByRecipeIdAndUserIdOrCreate(userId, recipe.id, {
        isVisited: true,
      })
    }

    const sourceUrl = await this.s3Service.getPresignedLink(
      record.bucketKey,
      record.bucketName,
      galleryArticlesImagePresignedLinkExpires,
    )

    const isEnglish = i18n.lang === Language.English.toLocaleLowerCase()

    return {
      id: record.id,
      createAt: record.createAt,
      title: isEnglish ? record.titleEn : record.titleSp,
      text: isEnglish ? record.textEn : record.textSp,
      summary: isEnglish ? record.summaryEn : record.summarySp,
      isFavorite: userRecord?.isFavorite,
      isVisited: userRecord?.isVisited,
      sourceUrl,
      isArticle: record.isArticle,
    }
  }

  public async changeUserVideoStatusById(
    userId: string,
    videoId: string,
    params: PatchUserVideoStatusParamsDto,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const galleryVideo = await this.galleryVideoCrud.getVideoById(videoId)

    if (!galleryVideo) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.GalleryVideoNotFound),
        ErrorCodes.EntityNotFound,
        HttpStatus.NOT_FOUND,
      )
    }

    if (params.isViewed) {
      await this.storageService.incrementViewsCount(galleryVideo.video.id, i18n)
    }

    const userVideoItem = await this.userVideosCrudService.findByVideoIdAndUserIdOrCreate(userId, videoId)

    const updateResult = await this.userVideosCrudService.updateById(userVideoItem.id, params)

    return {
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
      code: SuccessCodes.WellnessJourneyItemUpdated,
      httpCode: HttpStatus.OK,
      details: { ...updateResult },
    }
  }

  public localizeVideoList(list: GalleryVideoEntity[], userVideosMeta: UserVideosEntity[], lang: string) {
    const isEnglish = lang === Language.English.toLocaleLowerCase()

    const userVideosMetaMap = new Map()

    userVideosMeta.forEach((video) => userVideosMetaMap.set(video.galleryItemId, video))

    return list.map(
      ({ id, createAt, type, titleEn, titleSp, descriptionEn, descriptionSp, keywordsEn, keywordsSp }) => {
        const userVideo = userVideosMetaMap.get(id)

        return {
          id,
          createAt,
          type,
          title: isEnglish ? titleEn : titleSp,
          description: isEnglish ? descriptionEn : descriptionSp,
          keywords: isEnglish ? keywordsEn : keywordsSp,
          isFavorite: userVideo ? userVideo['isFavorite'] : false,
          isVisited: userVideo ? userVideo['isVisited'] : false,
          isViewed: userVideo ? userVideo['isViewed'] : false,
        }
      },
    )
  }

  public localizeArticleList(
    list: (GalleryArticleResponseDTO | GalleryRecipeResponseDTO)[],
    userRecords: (UserArticlesEntity | UserRecipesEntity)[],
    lang: string,
  ) {
    const isEnglish = lang === Language.English.toLocaleLowerCase()

    const recordsMap = new Map()
    userRecords.forEach((record) => recordsMap.set(record.galleryItemId, record))

    return list.map(
      ({ id, createAt, titleEn, titleSp, summaryEn, summarySp, keywordsEn, keywordsSp, textEn, textSp, isArticle }) => {
        const userRecord = recordsMap.get(id)
        return {
          id,
          createAt,
          title: isEnglish ? titleEn : titleSp,
          text: isEnglish ? textEn : textSp,
          summary: isEnglish ? summaryEn : summarySp,
          keywords: isEnglish ? keywordsEn : keywordsSp,
          isFavorite: userRecord ? userRecord['isFavorite'] : false,
          isVisited: userRecord ? userRecord['isVisited'] : false,
          isArticle,
        }
      },
    )
  }
}
