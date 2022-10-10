import { I18nContext } from 'nestjs-i18n'
import { Injectable } from '@nestjs/common'
import {
  foodPdfPresignedLinkExpires,
  foodPreviewImagePresignedLinkExpires,
  galleryRecipeImagePresignedLinkExpires,
  galleryVideoPreviewPresignLinkExpires,
  VideoTypes,
} from '../../../constants/enums/gallery.constants'
import { PageMetaDTO, PageDTO, PaginationOptionsDTO } from '../../../core/dtos/pagination'
import { FoodEntity } from '../../../database/entities/food.entity'
import { S3Service } from '../../../integrations/s3/s3.service'
import { GalleryVideosGrudService } from '../gallery/cruds/gallery-video.crud'
import { UserVideosCrudService } from '../user-videos/user-videos.crud'
import { GetFoodListResponseParamsDto } from './dto/food-response.dto'
import { GetFoodVideoListParamsDto, GetRecipesListParamsDto } from './dto/food.dto'
import { FoodCrudService } from './food.crud'
import { GalleryService } from '../gallery/gallery.service'
import {
  GalleryRecipeLocalizedResponseDTO,
  GalleryRecipeResponseDTO,
  GalleryVideoListResponseDTO,
} from '../gallery/dto/gallery.response.dto'
import { GalleryRecipeCrudService } from '../gallery/cruds/gallery-recipe.crud'
import { UserRecipesCrudService } from '../user-recipes/user-recipes.crud'

@Injectable()
export class FoodService {
  constructor(
    private foodCrudService: FoodCrudService,
    private s3Service: S3Service,
    private galleryService: GalleryService,
    private galleryVideoCrudService: GalleryVideosGrudService,
    private galleryRecipeCrud: GalleryRecipeCrudService,
    private userVideosCrudService: UserVideosCrudService,
    private userRecipesCrudService: UserRecipesCrudService,
  ) {}

  public async getFoodList(params: PaginationOptionsDTO): Promise<PageDTO<GetFoodListResponseParamsDto>> {
    const { entities, totalCount } = await this.foodCrudService.getAllWithParams(params)

    const presignedLinkPromises = entities.map(
      async ({ id, title, bucketKey, bucketName, videoPreview }: FoodEntity) => ({
        id,
        title,
        url: await this.s3Service.getPresignedLink(bucketKey, bucketName, foodPdfPresignedLinkExpires),
        image: await this.s3Service.getPresignedLink(
          videoPreview.bucketKey,
          videoPreview.bucketName,
          foodPreviewImagePresignedLinkExpires,
        ),
      }),
    )

    const preparedFoodResponse = await Promise.all(presignedLinkPromises)

    const pageMetaDto = new PageMetaDTO({ paginationOptionsDto: params, itemCount: totalCount })

    return new PageDTO(preparedFoodResponse, pageMetaDto)
  }

  public async getFoodVideoList(
    userId: string,
    params: GetFoodVideoListParamsDto,
    i18n: I18nContext,
  ): Promise<PageDTO<GalleryVideoListResponseDTO>> {
    const galleryVideosPage = await this.galleryVideoCrudService.getVideos(params, VideoTypes.food)

    const userVideosMeta = await this.userVideosCrudService.findManyByUserIdWithParams(userId, {})

    const getPresignedLinkPromises = galleryVideosPage.data.map((video) =>
      this.s3Service.getPresignedLink(
        video.videoPreview.bucketKey,
        video.videoPreview.bucketName,
        galleryVideoPreviewPresignLinkExpires,
      ),
    )

    const videoPreviewPresingedLinks = await Promise.allSettled(getPresignedLinkPromises)

    const localizedVideoList = this.galleryService.localizeVideoList(galleryVideosPage.data, userVideosMeta, i18n.lang)

    const videoPreviewPresignedLink = localizedVideoList.map((video, index) => {
      const presignedPreviewPromiseResponse = videoPreviewPresingedLinks[index]

      return { ...video, sourceUrl: presignedPreviewPromiseResponse['value'] }
    })

    return new PageDTO(videoPreviewPresignedLink, galleryVideosPage.meta)
  }

  public async getRecipeList(
    userId: string,
    params: GetRecipesListParamsDto,
    i18n: I18nContext,
  ): Promise<PageDTO<GalleryRecipeLocalizedResponseDTO>> {
    const { data, meta } = await this.galleryRecipeCrud.getRecipesWithParams(params)
    const userRecipes = await this.userRecipesCrudService.findManyByUserIdWithParams(userId)

    const localizedList = this.galleryService.localizeArticleList(
      data as GalleryRecipeResponseDTO[],
      userRecipes,
      i18n.lang,
    )

    const recipeListPromises = localizedList.map(async (recipe, index) => ({
      ...recipe,
      sourceUrl: await this.s3Service.getPresignedLink(
        data[index].image.bucketKey,
        data[index].image.bucketName,
        galleryRecipeImagePresignedLinkExpires,
      ),
    }))

    const formatedRecipeListData = (await Promise.allSettled(recipeListPromises)).map((item) => item['value'])

    return new PageDTO(formatedRecipeListData, meta)
  }
}
