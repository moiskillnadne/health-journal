import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Post, Body, Req, Query } from '@nestjs/common'
import { I18n, I18nContext } from 'nestjs-i18n'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { ForbiddenResponse } from '../../../core/dtos/response/forbidden.dto'

import { UserCardAfterMealBloodSugarService } from './user-card-after-meal-blood-sugar.service'

import {
  UserCardAfterMealBloodSugarQueryParamsDto,
  PostUserCardAfterMealBloodSugarParamsDto,
} from './dto/user-card-after-meal-blood-sugar.dto'
import {
  GetUserAfterMealBloodSugarResponseDto,
  GetUserAfterMealBloodSugarLastRecordResponseDto,
} from './dto/user-card-after-meal-blood-sugar.response.dto'

@ApiTags('User After Meal Blood Sugar')
@Controller('user/after-meal-blood-sugar')
export class UserCardAfterMealBloodSugarController {
  constructor(private userCardAfterMealBloodSugarService: UserCardAfterMealBloodSugarService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserAfterMealBloodSugarResponseDto, isArray: true })
  public getUserRandomBloodSugar(
    @Req() { user },
    @Query() params: UserCardAfterMealBloodSugarQueryParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userCardAfterMealBloodSugarService.getUserAfterMealBloodSugarByParams(user.id, params, i18n)
  }

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserAfterMealBloodSugarLastRecordResponseDto })
  public getUserAfterMealBloodSugarLastRecord(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardAfterMealBloodSugarService.getUserAfterMealBloodSugarLastRecordByUserId(user.id, i18n)
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Blood pressure added successfully.', type: BaseSuccessResponse })
  @ApiResponse({ status: 403, description: 'Forbidden. Token expired.', type: ForbiddenResponse })
  public addAfterMealBloodSugar(
    @Req() req,
    @Body() body: PostUserCardAfterMealBloodSugarParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userCardAfterMealBloodSugarService.addAfterMealBloodSugarRecord(req.user.id, body, i18n)
  }
}
