import { I18nContext } from 'nestjs-i18n'
import { Injectable } from '@nestjs/common'

import { Order } from '../../../constants/enums/pagination.constants'
import { galleryArticlesImagePresignedLinkExpires } from '../../../constants/enums/gallery.constants'

import { S3Service } from '../../../integrations/s3/s3.service'

import { UserArticlesCrudService } from './user-articles.crud'

import { GetUserFavoriteArticlesResponseDto } from './dto/user-articles.response.dto'

@Injectable()
export class UserArticlesService {
  constructor(private userArticlesCrudService: UserArticlesCrudService, private s3Service: S3Service) {}

  public async getUserFavoriteArticlesByUserId(
    userId: string,
    i18n: I18nContext,
  ): Promise<GetUserFavoriteArticlesResponseDto[]> {
    const articles = await this.userArticlesCrudService.findManyByUserIdWithParams(userId, {
      where: {
        isFavorite: true,
      },
      relations: {
        galleryItem: {
          image: true,
        },
      },
      order: {
        createAt: Order.DESC,
      },
    })

    const favourites = articles.map(async (article) => {
      return {
        id: article.galleryItem.id,
        title: i18n.lang === 'en' ? article.galleryItem.titleEn : article.galleryItem.titleSp,
        preview: await this.s3Service.getPresignedLink(
          article.galleryItem.image?.bucketKey,
          article.galleryItem.image?.bucketName,
          galleryArticlesImagePresignedLinkExpires,
        ),
        isVisited: article.isVisited,
      }
    })

    return Promise.all(favourites)
  }
}
