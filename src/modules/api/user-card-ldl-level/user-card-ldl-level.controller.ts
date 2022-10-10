import { I18n, I18nContext } from 'nestjs-i18n'
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { UserCardLdlLevelService } from './user-card-ldl-level.service'

import {
  GetUserLdlLevelLastRecordResponseDto,
  GetUserLdlLevelResponseDto,
} from './dto/user-card-ldl-level.response.dto'
import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { ForbiddenResponse } from '../../../core/dtos/response/forbidden.dto'
import { IBaseResponse } from '../../../models/response.models'
import { PostUserCardLdlLevelParamsDto, UserCardLdlLevelQueryParamsDto } from './dto/user-card-ldl-level.dto'

@ApiTags('User LDL Level')
@Controller('user/ldl')
export class UserCardLdlLevelController {
  constructor(private userCardLdlLevelService: UserCardLdlLevelService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserLdlLevelResponseDto, isArray: true })
  public getUserLdlLevel(@Req() { user }, @Query() params: UserCardLdlLevelQueryParamsDto, @I18n() i18n: I18nContext) {
    return this.userCardLdlLevelService.getUserLdlLevel(user.id, params, i18n)
  }

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserLdlLevelLastRecordResponseDto })
  public getUserLdlLevelLastRecord(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardLdlLevelService.getUserLdlLevelLastRecordByUserId(user.id, i18n)
  }

  @Post()
  @ApiResponse({ status: 201, type: BaseSuccessResponse })
  @ApiResponse({ status: 403, type: ForbiddenResponse })
  public addLdlLevel(
    @Req() req,
    @Body() body: PostUserCardLdlLevelParamsDto,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.userCardLdlLevelService.addLdlLevel(req.user.id, body, i18n)
  }
}
