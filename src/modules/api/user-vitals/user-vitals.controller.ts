import { I18n, I18nContext } from 'nestjs-i18n'
import { Controller, Get, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { UserVitalsService } from './user-vitals.service'

import {
  GetUserVitalsNewContent,
  GetUserVitalVideosResponseDto,
  GetUserVitalArticlesResponseDto,
} from './dto/user-vitals.response.dto'

@ApiTags('User Vitals')
@Controller('user/vitals')
export class UserVitalsController {
  constructor(private userVitalsService: UserVitalsService) {}

  @Get('new')
  @ApiResponse({ status: 200, type: GetUserVitalsNewContent })
  public getUserVitalsNewContent(@Req() { user }) {
    return this.userVitalsService.getUserVitalsNewContentByUserId(user.id)
  }

  @Get('video')
  @ApiResponse({ status: 200, type: GetUserVitalVideosResponseDto, isArray: true })
  public getUserVitalVideos(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userVitalsService.getUserVitalVideosByUserId(user.id, i18n)
  }

  @Get('article')
  @ApiResponse({ status: 200, type: GetUserVitalArticlesResponseDto, isArray: true })
  public getUserVitalArticles(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userVitalsService.getUserVitalArticlesByUserId(user.id, i18n)
  }
}
