import { I18nContext } from 'nestjs-i18n'
import { Injectable } from '@nestjs/common'

import { Order } from '../../../constants/enums/pagination.constants'
import { galleryVideoPreviewPresignLinkExpires } from '../../../constants/enums/gallery.constants'

import { S3Service } from '../../../integrations/s3/s3.service'

import { UserVideosCrudService } from './user-videos.crud'

import { GetUserFavoriteVideosResponseDto } from './dto/user-videos.response.dto'

@Injectable()
export class UserVideosService {
  constructor(private userVideosCrudService: UserVideosCrudService, private s3Service: S3Service) {}

  public async getUserFavoriteVideosByUserId(
    userId: string,
    i18n: I18nContext,
  ): Promise<GetUserFavoriteVideosResponseDto[]> {
    const videos = await this.userVideosCrudService.findManyByUserIdWithParams(userId, {
      where: {
        isFavorite: true,
      },
      relations: {
        galleryItem: {
          videoPreview: true,
        },
      },
      order: {
        createAt: Order.DESC,
      },
    })

    const favourites = videos.map(async (video) => {
      return {
        id: video.galleryItem.id,
        title: i18n.lang === 'en' ? video.galleryItem.titleEn : video.galleryItem.titleSp,
        preview: await this.s3Service.getPresignedLink(
          video.galleryItem.videoPreview?.bucketKey,
          video.galleryItem.videoPreview?.bucketName,
          galleryVideoPreviewPresignLinkExpires,
        ),
        isViewed: video.isViewed,
        isVisited: video.isVisited,
      }
    })

    return Promise.all(favourites)
  }
}
