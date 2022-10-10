import { I18n, I18nContext } from 'nestjs-i18n'
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger'

import { PageDTO } from '../../../core/dtos/pagination'
import { ApiPageResponse } from '../../../core/decorators/swagger/api-page-response.decorator'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'

import { UserCardStepsService } from './user-card-steps.service'

import { UserCardStepsQueryParamsDto, UserCardStepsBodyParamsDto } from './dto/user-card-steps.dto'
import { GetUserStepsResponseDto, GetUserStepsLastRecordResponseDto } from './dto/user-card-steps.response.dto'

@ApiTags('User Steps')
@Controller('user/steps')
export class UserCardStepsController {
  constructor(private userCardStepsService: UserCardStepsService) {}

  @Get()
  @ApiExtraModels(PageDTO, GetUserStepsResponseDto)
  @ApiPageResponse(GetUserStepsResponseDto, { status: 200 })
  public getUserSteps(@Req() { user }, @Query() params: UserCardStepsQueryParamsDto, @I18n() i18n: I18nContext) {
    return this.userCardStepsService.getUserStepsByParams(user.id, params, i18n)
  }

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserStepsLastRecordResponseDto })
  public getUserStepsLastRecord(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardStepsService.getUserStepsLastRecordByUserId(user.id, i18n)
  }

  @Post()
  @ApiResponse({ status: 201, type: BaseSuccessResponse })
  public addUserSteps(@Req() { user }, @Body() body: UserCardStepsBodyParamsDto, @I18n() i18n: I18nContext) {
    return this.userCardStepsService.addUserStepsByUserId(user.id, body, i18n)
  }
}
