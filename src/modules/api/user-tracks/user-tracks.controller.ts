import { I18n, I18nContext } from 'nestjs-i18n'
import { Controller, Get, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { UserTracksService } from './user-tracks.service'

import {
  GetUserTracksNewContent,
  GetUserTrackVideosResponseDto,
  GetUserTrackArticlesResponseDto,
  GetUserTrackRecipesResponseDto,
} from './dto/user-tracks.response.dto'

@ApiTags('User Tracks')
@Controller('user/tracks')
export class UserTracksController {
  constructor(private userCardStepsService: UserTracksService) {}

  @Get('new')
  @ApiResponse({ status: 200, type: GetUserTracksNewContent })
  public getUserTracksNewContent(@Req() { user }) {
    return this.userCardStepsService.getUserTracksNewContentByUserId(user.id)
  }

  @Get('video')
  @ApiResponse({ status: 200, type: GetUserTrackVideosResponseDto, isArray: true })
  public getUserTrackVideos(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardStepsService.getUserTrackVideosByUserId(user.id, i18n)
  }

  @Get('article')
  @ApiResponse({ status: 200, type: GetUserTrackArticlesResponseDto, isArray: true })
  public getUserTrackArticles(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardStepsService.getUserTrackArticlesByUserId(user.id, i18n)
  }

  @Get('recipe')
  @ApiResponse({ status: 200, type: GetUserTrackRecipesResponseDto, isArray: true })
  public getUserTrackRecipes(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardStepsService.getUserTrackRecipesByUserId(user.id, i18n)
  }
}
