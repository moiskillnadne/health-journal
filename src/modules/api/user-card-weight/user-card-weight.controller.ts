import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { I18n, I18nContext } from 'nestjs-i18n'

import { ForbiddenResponse } from '../../../core/dtos/response/forbidden.dto'
import { IBaseResponse } from '../../../models/response.models'

import { UserCardWeightService } from './user-card-weight.service'

import { PostUserCardWeightParamsDto, UserCardWeightHistoryQueryParamsDto } from './dto/user-card-weight.dto'
import {
  GetUserWeightHistoryResponseDto,
  GetUserWeightLastRecordResponseDto,
  PostWeightReponseDTO,
} from './dto/user-card-weight.response.dto'

@ApiTags('User Weight')
@Controller('user/weight')
export class UserCardWeightController {
  constructor(private userCardWeightService: UserCardWeightService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserWeightHistoryResponseDto, isArray: true })
  public getUserWeightHistory(
    @Req() { user },
    @Query() params: UserCardWeightHistoryQueryParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userCardWeightService.getUserWeightHistoryByParams(user.id, params, i18n)
  }

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserWeightLastRecordResponseDto })
  public getUserWeightLastRecord(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardWeightService.getUserWeightLastRecordByUserId(user.id, i18n)
  }

  @Post()
  @ApiResponse({ status: 201, description: 'The record has been successfully created.', type: PostWeightReponseDTO })
  @ApiResponse({ status: 403, description: 'Forbidden. Token expired', type: ForbiddenResponse })
  public addWeight(
    @Req() req,
    @Body() body: PostUserCardWeightParamsDto,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.userCardWeightService.addWeightToUserHistory(req.user.id, body, i18n)
  }
}
