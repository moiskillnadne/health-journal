import { I18n, I18nContext } from 'nestjs-i18n'
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { ForbiddenResponse } from '../../../core/dtos/response/forbidden.dto'

import { UserCardFastingBloodSugarService } from './user-card-fasting-blood-sugar.service'

import {
  UserCardFastingBloodSugarQueryParamsDto,
  PostUserCardFastingBloodSugarParamsDto,
} from './dto/user-card-fasting-blood-sugar.dto'
import {
  GetUserFastingBloodSugarResponseDto,
  GetUserFastingBloodSugarLastRecordResponseDto,
} from './dto/user-card-fasting-blood-sugar.response.dto'

@ApiTags('User Fasting Blood Sugar')
@Controller('user/fasting-blood-sugar')
export class UserCardFastingBloodSugarController {
  constructor(private userCardFastingBloodSugarService: UserCardFastingBloodSugarService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserFastingBloodSugarResponseDto, isArray: true })
  public getUserRandomBloodSugar(
    @Req() { user },
    @Query() params: UserCardFastingBloodSugarQueryParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userCardFastingBloodSugarService.getUserFastingBloodSugarByParams(user.id, params, i18n)
  }

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserFastingBloodSugarLastRecordResponseDto })
  public getUserAfterMealBloodSugarLastRecord(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardFastingBloodSugarService.getUserFastingBloodSugarLastRecordByUserId(user.id, i18n)
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Blood pressure added successfully.', type: BaseSuccessResponse })
  @ApiResponse({ status: 403, description: 'Forbidden. Token expired.', type: ForbiddenResponse })
  public addFastingBloodSugar(
    @Req() req,
    @Body() body: PostUserCardFastingBloodSugarParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userCardFastingBloodSugarService.addFastingBloodSugar(req.user.id, body, i18n)
  }
}
