import { Controller, Get, Query, Req } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'
import { ApiPageResponse } from '../../../core/decorators/swagger/api-page-response.decorator'
import { PageDTO, PaginationOptionsDTO } from '../../../core/dtos/pagination'
import { GalleryRecipeLocalizedResponseDTO, GallerySingleVideoResponseDTO } from '../gallery/dto/gallery.response.dto'
import { GetFoodListResponseParamsDto } from './dto/food-response.dto'
import { GetFoodVideoListParamsDto, GetRecipesListParamsDto } from './dto/food.dto'
import { FoodService } from './food.service'

@ApiTags('Food')
@Controller('food')
export class FoodController {
  constructor(private foodService: FoodService) {}

  @Get()
  @ApiPageResponse(GetFoodListResponseParamsDto, { status: 200 })
  @ApiExtraModels(PageDTO, GetFoodListResponseParamsDto)
  public getFoodList(@Query() params: PaginationOptionsDTO): Promise<PageDTO<GetFoodListResponseParamsDto>> {
    return this.foodService.getFoodList(params)
  }

  @Get('videos')
  @ApiPageResponse(GallerySingleVideoResponseDTO, { status: 200 })
  @ApiExtraModels(PageDTO, GallerySingleVideoResponseDTO)
  public getFoodVideoList(@Req() { user }, @Query() params: GetFoodVideoListParamsDto, @I18n() i18n: I18nContext) {
    return this.foodService.getFoodVideoList(user.id, params, i18n)
  }

  @Get('recipes')
  @ApiPageResponse(GalleryRecipeLocalizedResponseDTO, { status: 200 })
  @ApiExtraModels(PageDTO, GalleryRecipeLocalizedResponseDTO)
  public getRecipeList(@Req() { user }, @Query() params: GetRecipesListParamsDto, @I18n() i18n: I18nContext) {
    return this.foodService.getRecipeList(user.id, params, i18n)
  }
}
