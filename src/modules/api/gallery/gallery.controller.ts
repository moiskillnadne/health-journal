import { BaseSuccessResponse } from './../../../core/dtos/response/base-success.dto'
import { I18n, I18nContext } from 'nestjs-i18n'
import { Controller, Get, Param, Query, Res, Headers, Patch, Req, Body } from '@nestjs/common'
import { GalleryService } from './gallery.service'
import { StorageListingOptionsDTO } from '../admin/storage/storage.dto'
import { ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger'

import { PageDTO } from '../../../core/dtos/pagination'
import { ApiPageResponse } from '../../../core/decorators/swagger/api-page-response.decorator'

import {
  GalleryArticleLocalizedResponseDTO,
  GalleryRecipeLocalizedResponseDTO,
  GallerySingleArticleResponseDTO,
  GallerySingleVideoResponseDTO,
  GalleryVideoListResponseDTO,
} from './dto/gallery.response.dto'
import { Public } from '../../../core/decorators/public-route.decorator'
import { IBaseResponse } from '../../../models/response.models'
import { PatchUserArticleStatusOptionalParamsDto, PatchUserVideoStatusParamsDto } from './dto/gallery.dto'

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Get('videos')
  @ApiPageResponse(GallerySingleVideoResponseDTO, { status: 200 })
  @ApiExtraModels(PageDTO, GallerySingleVideoResponseDTO)
  public getGalleryVideos(
    @Req() { user },
    @Query() options: StorageListingOptionsDTO,
    @I18n() i18n: I18nContext,
  ): Promise<PageDTO<GalleryVideoListResponseDTO>> {
    return this.galleryService.getGalleryVideos(user.id, options, i18n)
  }

  @Public()
  @Get('stream/:videoId')
  public async getStreamVideo(@Param('videoId') id: string, @Headers() headers, @Res() res, @I18n() i18n: I18nContext) {
    const range = headers.range

    const videoData = await this.galleryService.getStreamVideo(id, i18n, range)

    res.writeHead(206, videoData.headers)

    videoData.stream.pipe(res)
  }

  @Get('video/:videoId')
  public getGalleryVideo(
    @Req() { user },
    @Param('videoId') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<GallerySingleVideoResponseDTO> {
    return this.galleryService.getGalleryVideoById(id, user.id, i18n)
  }

  @Get('articles')
  @ApiExtraModels(PageDTO, GalleryArticleLocalizedResponseDTO, GalleryRecipeLocalizedResponseDTO)
  @ApiResponse({
    status: 200,
    schema: {
      allOf: [
        { $ref: getSchemaPath(PageDTO) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                oneOf: [
                  { $ref: getSchemaPath(GalleryArticleLocalizedResponseDTO) },
                  { $ref: getSchemaPath(GalleryRecipeLocalizedResponseDTO) },
                ],
              },
            },
          },
        },
      ],
    },
  })
  public getGalleryArticlesAndRecipes(
    @Req() { user },
    @Query() options: StorageListingOptionsDTO,
    @I18n() i18n: I18nContext,
  ): Promise<PageDTO<GalleryArticleLocalizedResponseDTO>> {
    return this.galleryService.getGalleryArticlesAndRecipesByParams(user.id, options, i18n)
  }

  @Get('article/:articleId')
  @ApiExtraModels(GalleryArticleLocalizedResponseDTO, GalleryRecipeLocalizedResponseDTO)
  @ApiResponse({
    status: 200,
    schema: {
      oneOf: [
        { $ref: getSchemaPath(GalleryArticleLocalizedResponseDTO) },
        { $ref: getSchemaPath(GalleryRecipeLocalizedResponseDTO) },
      ],
    },
  })
  public getGalleryArticle(
    @Req() { user },
    @Param('articleId') id: string,
    @I18n() i18n: I18nContext,
  ): Promise<GallerySingleArticleResponseDTO> {
    return this.galleryService.getGalleryArticleOrRecipeById(id, user.id, i18n)
  }

  @Patch('article/:articleId')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public patchUserArticleStatus(
    @Param('articleId') articleId: string,
    @Body() body: PatchUserArticleStatusOptionalParamsDto,
    @Req() { user },
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.galleryService.patchUserArticleStatus(user.id, articleId, body, i18n)
  }

  @Patch('recipe/:recipeId')
  @ApiResponse({ status: 200, type: BaseSuccessResponse })
  public patchUserRecipeStatus(
    @Param('recipeId') recipeId: string,
    @Body() body: PatchUserArticleStatusOptionalParamsDto,
    @Req() { user },
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.galleryService.patchUserRecipeStatus(user.id, recipeId, body, i18n)
  }

  @Patch('video/:videoId')
  public changeUserVideoStatus(
    @Param('videoId') videoId: string,
    @Body() body: PatchUserVideoStatusParamsDto,
    @Req() { user },
    @I18n() i18n: I18nContext,
  ) {
    return this.galleryService.changeUserVideoStatusById(user.id, videoId, body, i18n)
  }
}
