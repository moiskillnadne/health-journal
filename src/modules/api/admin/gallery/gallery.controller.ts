import { Body, Controller, Post, Get, Query, Patch, Delete, HttpCode } from '@nestjs/common'
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
  PatchGalleryArticleResponseDTO,
  PatchGalleryRecipeResponseDTO,
  PatchGalleryVideoResponseDTO,
  PatchRecipeDTO,
  PatchVideoDTO,
  PostGalleryArticleResponseDTO,
  PostGalleryRecipeResponseDTO,
  PostGalleryVideoResponseDTO,
  SearchOptionsDTO,
} from './gallery.dto'
import { GalleryService } from './gallery.service'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { RequirePermissions } from '../../../../core/decorators/permissions.decorators'
import { GalleryPermissions } from '../../../../constants/permissions/admin.constants'
import { ParamUIID } from '../../../../core/decorators/param-uiid.decorator'
import { ValidationErrorResponse } from '../../../../core/dtos/response/validation-error.dto'
import { InternalServerErrorResponse } from '../../../../core/dtos/response/internal-server-error.dto'
import { NotFoundResponse } from '../../../../core/dtos/response/not-found-error.dto'

@ApiTags('Admin Gallery')
@Controller('/web-admin/gallery')
export class GalleryController {
  constructor(private galleryService: GalleryService) {}

  @Post('video')
  @HttpCode(201)
  @ApiResponse({ status: 201, type: PostGalleryVideoResponseDTO })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canCreate)
  addVideo(@Body() addVideoDTO: AddVideoDTO) {
    return this.galleryService.addVideo(addVideoDTO)
  }

  @Post('article')
  @HttpCode(201)
  @ApiResponse({ status: 201, type: PostGalleryArticleResponseDTO })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canCreate)
  addArticle(@Body() addArticleDTO: AddArticleDTO) {
    return this.galleryService.addArticle(addArticleDTO)
  }

  @Post('recipe')
  @HttpCode(201)
  @ApiResponse({ status: 201, type: PostGalleryRecipeResponseDTO })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponse })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canCreate)
  addRecipe(@Body() addRecipeDTO: AddRecipeDTO) {
    return this.galleryService.addRecipe(addRecipeDTO)
  }

  @Get('search')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GallerySearchResponseDTO })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canView)
  searchAssets(@Query() searchOptionsDTO: SearchOptionsDTO) {
    return this.galleryService.searchGalleryAssets(searchOptionsDTO)
  }

  @Get('video')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetGalleryVideoResponseDTO })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canView)
  getVideos(@Query() options: GalleryVideosListingOptionsDTO) {
    return this.galleryService.getGalleryVideos(options)
  }

  @Get('article')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetGalleryArticleResponseDTO })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canView)
  getArticles(@Query() options: GalleryArticlesListingOptionsDTO) {
    return this.galleryService.getGalleryArticles(options)
  }

  @Get('recipe')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetGalleryRecipeResponseDTO })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canView)
  getRecipes(@Query() options: GalleryRecipesListingOptionsDTO) {
    return this.galleryService.getGalleryRecipes(options)
  }

  @Patch('video/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: PatchGalleryVideoResponseDTO })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponse })
  @ApiResponse({ status: 404, description: 'Entity not found', type: NotFoundResponse })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canUpdate)
  updateVideo(@ParamUIID('id') id: string, @Body() patchVideoDTO: PatchVideoDTO) {
    return this.galleryService.patchGalleryVideo(id, patchVideoDTO)
  }

  @Patch('article/:id')
  @HttpCode(200)
  @ApiResponse({ status: 201, type: PatchGalleryArticleResponseDTO })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponse })
  @ApiResponse({ status: 404, description: 'Entity not found', type: NotFoundResponse })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canUpdate)
  updateArticle(@ParamUIID('id') id: string, @Body() patchArticleDTO: PatchArticleDTO) {
    return this.galleryService.patchGalleryArticle(id, patchArticleDTO)
  }

  @Patch('recipe/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: PatchGalleryRecipeResponseDTO })
  @ApiResponse({ status: 400, description: 'Validation error', type: ValidationErrorResponse })
  @ApiResponse({ status: 404, description: 'Entity not found', type: NotFoundResponse })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canUpdate)
  updateRecipe(@ParamUIID('id') id: string, @Body() patchRecipeDTO: PatchRecipeDTO) {
    return this.galleryService.patchGalleryRecipe(id, patchRecipeDTO)
  }

  @Delete('video/:id')
  @ApiResponse({ status: 404, description: 'Entity not found', type: NotFoundResponse })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canDelete)
  deleteVideo(@ParamUIID('id') id: string) {
    return this.galleryService.deleteGalleryVideo(id)
  }

  @Delete('article/:id')
  @ApiResponse({ status: 404, description: 'Entity not found', type: NotFoundResponse })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canDelete)
  deleteArticle(@ParamUIID('id') id: string) {
    return this.galleryService.deleteGalleryArticle(id)
  }

  @Delete('recipe/:id')
  @ApiResponse({ status: 404, description: 'Entity not found', type: NotFoundResponse })
  @ApiResponse({ status: 500, description: 'Internal Server Error', type: InternalServerErrorResponse })
  @RequirePermissions(GalleryPermissions.canDelete)
  deleteRecipe(@ParamUIID('id') id: string) {
    return this.galleryService.deleteGalleryRecipe(id)
  }
}
