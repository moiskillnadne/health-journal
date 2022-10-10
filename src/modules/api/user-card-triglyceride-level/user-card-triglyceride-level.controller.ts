import { I18n, I18nContext } from 'nestjs-i18n'
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { UserCardTriglycerideLevelService } from './user-card-triglyceride-level.service'

import {
  GetUserTriglycerideLevelLastRecordResponseDto,
  GetUserTriglycerideResponseDto,
} from './dto/user-card-triglyceride-level.response.dto'
import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { ForbiddenResponse } from '../../../core/dtos/response/forbidden.dto'
import { IBaseResponse } from '../../../models/response.models'
import {
  PostUserCardTriglycerideLevelParamsDto,
  UserCardTriglycerideLevelPeriodParamsDto,
} from './dto/user-card-triglyceride-level.dto'

@ApiTags('User Triglyceride Level')
@Controller('user/triglyceride')
export class UserCardTriglycerideLevelController {
  constructor(private userCardTriglycerideLevelService: UserCardTriglycerideLevelService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserTriglycerideResponseDto, isArray: true })
  public getUserTriglycerideLevel(
    @Req() { user },
    @Query() params: UserCardTriglycerideLevelPeriodParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userCardTriglycerideLevelService.getUserCardTriglycerideLevel(user.id, params, i18n)
  }

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserTriglycerideLevelLastRecordResponseDto })
  public getUserTriglycerideLevelLastRecord(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardTriglycerideLevelService.getUserTriglycerideLevelLastRecordByUserId(user.id, i18n)
  }

  @Post()
  @ApiResponse({ status: 201, type: BaseSuccessResponse })
  @ApiResponse({ status: 403, type: ForbiddenResponse })
  public addTriglyceridesLevel(
    @Req() req,
    @Body() body: PostUserCardTriglycerideLevelParamsDto,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.userCardTriglycerideLevelService.addTriglycerideLevel(req.user.id, body, i18n)
  }
}
