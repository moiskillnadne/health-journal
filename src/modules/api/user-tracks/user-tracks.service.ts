import { In } from 'typeorm'
import { I18nContext } from 'nestjs-i18n'
import { HttpStatus, Injectable } from '@nestjs/common'

import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { IBaseResponse } from '../../../models/response.models'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import {
  galleryVideoPreviewPresignLinkExpires,
  galleryArticlesImagePresignedLinkExpires,
  galleryRecipeImagePresignedLinkExpires,
} from '../../../constants/enums/gallery.constants'

import { UserTracksEntity } from '../../../database/entities/user-tracks.entity'

import { S3Service } from '../../../integrations/s3/s3.service'

import { UserCrudService } from '../user/user.crud'
import { TrackCrud } from '../admin/track/crud/track.crud'

import {
  getUserTrackLines,
  getUserTracksContent,
  checkRelatedNewContent,
  getUserVideoFlags,
  getUserArticleFlags,
} from './user-tracks.helper'

import { UserTracksCrudService } from './user-tracks.crud'

import {
  GetUserTrackVideosResponseDto,
  GetUserTrackArticlesResponseDto,
  GetUserTrackRecipesResponseDto,
} from './dto/user-tracks.response.dto'

@Injectable()
export class UserTracksService {
  constructor(
    private userTracksCrudService: UserTracksCrudService,
    private userCrudService: UserCrudService,
    private trackCrudService: TrackCrud,
    private s3Service: S3Service,
  ) {}

  public async getUserTracksNewContentByUserId(userId: string): Promise<any> {
    const tracks = await this.userTracksCrudService.getUserTracksByParams(userId, {
      where: {
        track: {
          isPublished: true,
        },
      },
      relations: {
        track: {
          groups: {
            lines: {
              video: {
                userVideos: true,
              },
              article: {
                userArticles: true,
              },
              recipe: {
                userRecipes: true,
              },
            },
          },
        },
      },
    })

    return tracks.reduce(
      (result, item) => {
        const lines = getUserTrackLines(item)

        lines.forEach((line) => {
          if (
            line.video?.isPublished &&
            checkRelatedNewContent(userId, line.video.userVideos) &&
            !result.videos.includes(item.trackId)
          ) {
            result.videos.push(item.trackId)
          }

          if (
            line.article?.isPublished &&
            checkRelatedNewContent(userId, line.article.userArticles) &&
            !result.articles.includes(item.trackId)
          ) {
            result.articles.push(item.trackId)
          }

          if (
            line.recipe?.isPublished &&
            checkRelatedNewContent(userId, line.recipe.userRecipes) &&
            !result.recipes.includes(item.trackId)
          ) {
            result.recipes.push(item.trackId)
          }
        })

        return result
      },
      {
        videos: [],
        articles: [],
        recipes: [],
      },
    )
  }

  public async getUserTrackVideosByUserId(userId: string, i18n: I18nContext): Promise<GetUserTrackVideosResponseDto[]> {
    const tracks = await this.userTracksCrudService.getUserTracksByParams(userId, {
      where: {
        track: {
          isPublished: true,
        },
      },
      relations: {
        track: {
          groups: {
            lines: {
              video: {
                videoPreview: true,
                userVideos: true,
              },
            },
          },
        },
      },
    })

    const content = getUserTracksContent(tracks, 'video', i18n.lang)
    const previews = await Promise.all(
      content.map((track) =>
        Promise.all(
          track.items.map((item) =>
            this.s3Service.getPresignedLink(
              item.video.videoPreview.bucketKey,
              item.video.videoPreview.bucketName,
              galleryVideoPreviewPresignLinkExpires,
            ),
          ),
        ),
      ),
    )

    return content.map((track, index) => {
      return {
        ...track,
        items: track.items.map((line, i) => ({
          id: line.video.id,
          date: line.date,
          title: i18n.lang === 'en' ? line.video.titleEn : line.video.titleSp,
          preview: previews[index][i],
          ...getUserVideoFlags(userId, line.video.userVideos),
        })),
      }
    })
  }

  public async getUserTrackArticlesByUserId(
    userId: string,
    i18n: I18nContext,
  ): Promise<GetUserTrackArticlesResponseDto[]> {
    const tracks = await this.userTracksCrudService.getUserTracksByParams(userId, {
      where: {
        track: {
          isPublished: true,
        },
      },
      relations: {
        track: {
          groups: {
            lines: {
              article: {
                image: true,
                userArticles: true,
              },
            },
          },
        },
      },
    })

    const content = getUserTracksContent(tracks, 'article', i18n.lang)
    const previews = await Promise.all(
      content.map((track) =>
        Promise.all(
          track.items.map((item) =>
            this.s3Service.getPresignedLink(
              item.article.image.bucketKey,
              item.article.image.bucketName,
              galleryArticlesImagePresignedLinkExpires,
            ),
          ),
        ),
      ),
    )

    return content.map((track, index) => {
      return {
        ...track,
        items: track.items.map((line, i) => ({
          id: line.article.id,
          date: line.date,
          title: i18n.lang === 'en' ? line.article.titleEn : line.article.titleSp,
          preview: previews[index][i],
          ...getUserArticleFlags(userId, line.article.userArticles),
        })),
      }
    })
  }

  public async getUserTrackRecipesByUserId(
    userId: string,
    i18n: I18nContext,
  ): Promise<GetUserTrackRecipesResponseDto[]> {
    const tracks = await this.userTracksCrudService.getUserTracksByParams(userId, {
      where: {
        track: {
          isPublished: true,
        },
      },
      relations: {
        track: {
          groups: {
            lines: {
              recipe: {
                image: true,
                userRecipes: true,
              },
            },
          },
        },
      },
    })

    const content = getUserTracksContent(tracks, 'recipe', i18n.lang)
    const previews = await Promise.all(
      content.map((track) =>
        Promise.all(
          track.items.map((item) =>
            this.s3Service.getPresignedLink(
              item.recipe.image.bucketKey,
              item.recipe.image.bucketName,
              galleryRecipeImagePresignedLinkExpires,
            ),
          ),
        ),
      ),
    )

    return content.map((track, index) => {
      return {
        ...track,
        items: track.items.map((line, i) => ({
          id: line.recipe.id,
          date: line.date,
          title: i18n.lang === 'en' ? line.recipe.titleEn : line.recipe.titleSp,
          preview: previews[index][i],
          ...getUserArticleFlags(userId, line.recipe.userRecipes),
        })),
      }
    })
  }

  public async assignUserTracksByUserId(userId: string): Promise<UserTracksEntity[]> {
    const user = await this.userCrudService.getUserByIdWithRelations(userId, {
      targetGroups: {
        targetGroup: {
          tracks: true,
        },
      },
      tracks: true,
    })
    const assignTracks = [
      ...new Set(
        user.targetGroups.reduce((list, item) => {
          return [...list, ...item.targetGroup.tracks.map((track) => track.id)]
        }, []),
      ),
    ]
    const currentTracks = user.tracks.map((track) => track.trackId)
    const userTracks = assignTracks.reduce((trackList, trackId) => {
      if (!currentTracks.includes(trackId)) {
        trackList.push(trackId)
      }

      return trackList
    }, [])
    const promises = userTracks.map((trackId) => this.userTracksCrudService.addUserTrackByParams(userId, { trackId }))

    return Promise.all(promises)
  }

  public async assignTracksToUsersByTrackId(trackId: string): Promise<UserTracksEntity[]> {
    const track = await this.trackCrudService.getTrackById(trackId, ['targetGroups'])
    const groups = track.targetGroups.map((group) => group.id)
    const users = await this.userCrudService.getUsersByParams({
      select: {
        id: true,
      },
      where: {
        targetGroups: {
          targetGroupId: In(groups),
        },
      },
      relations: {
        targetGroups: true,
        tracks: true,
      },
    })
    const promises = users.reduce((list, user) => {
      if (!user.tracks.some((track) => track.trackId === trackId)) {
        list.push(this.userTracksCrudService.addUserTrackByParams(user.id, { trackId }))
      }
      return list
    }, [])

    return Promise.all(promises)
  }

  public async addUserTrackByParams(
    userId: string,
    params: UserTracksEntity,
    i18n: I18nContext,
  ): Promise<IBaseResponse> {
    const track = await this.userTracksCrudService.addUserTrackByParams(userId, params)

    return {
      code: SuccessCodes.UserTrackCreated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.CreatedSuccessfully),
      details: {
        ...track,
      },
    }
  }
}
