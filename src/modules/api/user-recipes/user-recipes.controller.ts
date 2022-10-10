import { I18n, I18nContext } from 'nestjs-i18n'
import { Controller, Get, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { UserRecipesService } from './user-recipes.service'

import { GetUserFavoriteRecipesResponseDto } from './dto/user-recipes.response.dto'

@ApiTags('User Recipes')
@Controller('user/recipes')
export class UserRecipesController {
  constructor(private userRecipesService: UserRecipesService) {}

  @Get('favourite')
  @ApiResponse({ status: 200, type: GetUserFavoriteRecipesResponseDto, isArray: true })
  public getUserFavoriteRecipes(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userRecipesService.getUserFavoriteRecipesByUserId(user.id, i18n)
  }
}
