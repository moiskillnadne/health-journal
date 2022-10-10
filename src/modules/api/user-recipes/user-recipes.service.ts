import { I18nContext } from 'nestjs-i18n'
import { Injectable } from '@nestjs/common'

import { Order } from '../../../constants/enums/pagination.constants'
import { galleryRecipeImagePresignedLinkExpires } from '../../../constants/enums/gallery.constants'

import { S3Service } from '../../../integrations/s3/s3.service'

import { UserRecipesCrudService } from './user-recipes.crud'

import { GetUserFavoriteRecipesResponseDto } from './dto/user-recipes.response.dto'

@Injectable()
export class UserRecipesService {
  constructor(private userRecipesCrudService: UserRecipesCrudService, private s3Service: S3Service) {}

  public async getUserFavoriteRecipesByUserId(
    userId: string,
    i18n: I18nContext,
  ): Promise<GetUserFavoriteRecipesResponseDto[]> {
    const recipes = await this.userRecipesCrudService.findManyByUserIdWithParams(userId, {
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

    const favourites = recipes.map(async (recipe) => {
      return {
        id: recipe.galleryItem.id,
        title: i18n.lang === 'en' ? recipe.galleryItem.titleEn : recipe.galleryItem.titleSp,
        preview: await this.s3Service.getPresignedLink(
          recipe.galleryItem.image?.bucketKey,
          recipe.galleryItem.image?.bucketName,
          galleryRecipeImagePresignedLinkExpires,
        ),
        isVisited: recipe.isVisited,
      }
    })

    return Promise.all(favourites)
  }
}
