import { I18n, I18nContext } from 'nestjs-i18n'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'

import { ForbiddenResponse } from '../../../core/dtos/response/forbidden.dto'
import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'

import { UserCardRandomBloodSugarService } from './user-card-random-blood-sugar.service'

import {
  UserCardRandomBloodSugarQueryParamsDto,
  RandomBloodSugarWithGoalParamsDto,
} from './dto/user-card-random-blood-sugar.dto'
import {
  GetUserRandomBloodSugarResponseDto,
  GetUserRandomBloodSugarLastRecordResponseDto,
} from './dto/user-card-random-blood-sugar.response.dto'

@ApiTags('User Random Blood Sugar')
@Controller('user/random-blood-sugar')
export class UserCardRandomBloodSugarController {
  constructor(private userCardRandomBloodSugarService: UserCardRandomBloodSugarService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserRandomBloodSugarResponseDto, isArray: true })
  public getUserRandomBloodSugar(
    @Req() { user },
    @Query() params: UserCardRandomBloodSugarQueryParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userCardRandomBloodSugarService.getUserRandomBloodSugarByParams(user.id, params, i18n)
  }

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserRandomBloodSugarLastRecordResponseDto })
  public getUserRandomBloodSugarLastRecord(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardRandomBloodSugarService.getUserRandomBloodSugarLastRecordByUserId(user.id, i18n)
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Blood pressure added successfully.', type: BaseSuccessResponse })
  @ApiResponse({ status: 403, description: 'Forbidden. Token expired.', type: ForbiddenResponse })
  public addRandomBloodSugar(@Req() req, @Body() body: RandomBloodSugarWithGoalParamsDto, @I18n() i18n: I18nContext) {
    return this.userCardRandomBloodSugarService.addRandomBloodSugarRecord(req.user.id, body, i18n)
  }
}
