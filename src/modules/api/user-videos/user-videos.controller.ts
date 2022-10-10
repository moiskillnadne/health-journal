import { I18n, I18nContext } from 'nestjs-i18n'
import { Controller, Get, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { UserVideosService } from './user-videos.service'

import { GetUserFavoriteVideosResponseDto } from './dto/user-videos.response.dto'

@ApiTags('User Videos')
@Controller('user/videos')
export class UserVideosController {
  constructor(private userVideosService: UserVideosService) {}

  @Get('favourite')
  @ApiResponse({ status: 200, type: GetUserFavoriteVideosResponseDto, isArray: true })
  public getUserFavoriteVideos(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userVideosService.getUserFavoriteVideosByUserId(user.id, i18n)
  }
}
