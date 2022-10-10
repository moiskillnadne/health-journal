import { I18n, I18nContext } from 'nestjs-i18n'
import { Controller, Get, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { UserArticlesService } from './user-articles.service'

import { GetUserFavoriteArticlesResponseDto } from './dto/user-articles.response.dto'

@ApiTags('User Articles')
@Controller('user/articles')
export class UserArticlesController {
  constructor(private userArticlesService: UserArticlesService) {}

  @Get('favourite')
  @ApiResponse({ status: 200, type: GetUserFavoriteArticlesResponseDto, isArray: true })
  public getUserFavoriteArticles(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userArticlesService.getUserFavoriteArticlesByUserId(user.id, i18n)
  }
}
