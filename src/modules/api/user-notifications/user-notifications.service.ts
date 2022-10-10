import { HttpStatus, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { DictionaryPathToken } from '../../../constants/dictionary.constants'
import { ErrorCodes } from '../../../constants/responses/codes.error.constants'
import { SuccessCodes } from '../../../constants/responses/codes.success.constants'
import { galleryArticlesImagePresignedLinkExpires } from '../../../constants/enums/gallery.constants'

import { BadRequestError } from '../../../core/errors/bad-request.error'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { BadRequestErrorResponse } from '../../../core/dtos/response/bad-request-error.dto'

import { S3Service } from '../../../integrations/s3/s3.service'

import { UserNotificationsCrudService } from './user-notifications.crud'

import { GetUserNotificationsResponseDto } from './dto/user-notifications.response.dto'

@Injectable()
export class UserNotificationsService {
  constructor(private userNotificationsCrudService: UserNotificationsCrudService, private s3Service: S3Service) {}

  public async getUserNotificationsByUserId(userId: string): Promise<GetUserNotificationsResponseDto[]> {
    const notifications = await this.userNotificationsCrudService.getUserNotificationsByUserId(userId)

    const promises = notifications.map(async (interval) => {
      return {
        ...interval,
        items: await Promise.all(
          interval.items.map(async (item) => {
            return {
              ...item,
              ios: {
                ...item.ios,
                ...(item.ios.attachments?.bucketKey && item.ios.attachments?.bucketName
                  ? {
                      attachments: [
                        {
                          url: await this.s3Service.getPresignedLink(
                            item.ios.attachments.bucketKey,
                            item.ios.attachments.bucketName,
                            galleryArticlesImagePresignedLinkExpires,
                          ),
                        },
                      ],
                    }
                  : {
                      attachments: [],
                    }),
              },
              data: {
                ...item.data,
                ...(item.data.articleId?.id
                  ? { articleId: item.data.articleId.id, isContentValid: item.data.articleId.isPublished.toString() }
                  : {}),
                ...(item.data.recipeId?.id
                  ? { recipeId: item.data.recipeId.id, isContentValid: item.data.recipeId.isPublished.toString() }
                  : {}),
                ...(item.data.videoId?.id
                  ? { videoId: item.data.videoId.id, isContentValid: item.data.videoId.isPublished.toString() }
                  : {}),
                isViewed: item.data.isViewed.toString(),
              },
            }
          }),
        ),
      }
    })

    return Promise.all(promises)
  }

  public async getUserNotificationsCountByUserId(userId: string): Promise<number> {
    return this.userNotificationsCrudService.getUserNotificationsCountByUserId(userId)
  }

  public async updateUserNotificationsStatusByIds(ids: string[], i18n: I18nContext): Promise<BaseSuccessResponse> {
    await this.userNotificationsCrudService.updateUserNotificationsStatusByIds(ids)

    return {
      code: SuccessCodes.UserNotificationUpdated,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.UpdatedSuccessfully),
    }
  }

  public async deleteUserNotificationById(
    id: string,
    i18n: I18nContext,
  ): Promise<BaseSuccessResponse | BadRequestErrorResponse> {
    const notification = await this.userNotificationsCrudService.getUserNotificationById(id)

    if (!notification) {
      throw new BadRequestError(
        i18n.t(DictionaryPathToken.NotificationNotFound),
        ErrorCodes.BadRequestError,
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.userNotificationsCrudService.deleteUserNotificationById(id)

    return {
      code: SuccessCodes.UserNotificationDeleted,
      httpCode: HttpStatus.OK,
      message: i18n.t(DictionaryPathToken.DeletedSuccessfully),
    }
  }
}
