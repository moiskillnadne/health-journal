import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Post, Req, Body, Query } from '@nestjs/common'
import { I18n, I18nContext } from 'nestjs-i18n'

import { ForbiddenResponse } from '../../../core/dtos/response/forbidden.dto'
import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { IBaseResponse } from '../../../models/response.models'

import { UserCardBloodPressureService } from './user-card-blood-pressure.service'

import {
  UserCardBloodPressureQueryParamsDto,
  UserCardBloodPressureSaveBodyParamsDTO,
} from './dto/user-card-blood-pressure.dto'
import {
  GetUserBloodPressureResponseDto,
  GetUserBloodPressureLastRecordResponseDto,
} from './dto/user-card-blood-pressure.response.dto'

@ApiTags('User Blood Pressure')
@Controller('user/pressure')
export class UserCardBloodPressureController {
  constructor(private userCardBloodPressureService: UserCardBloodPressureService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserBloodPressureResponseDto, isArray: true })
  public getUserBloodPressure(
    @Req() { user },
    @Query() params: UserCardBloodPressureQueryParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userCardBloodPressureService.getUserBloodPressureByParams(user.id, params, i18n)
  }

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserBloodPressureLastRecordResponseDto })
  public getUserBloodPressureLastRecord(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardBloodPressureService.getUserBloodPressureLastRecordByUserId(user.id, i18n)
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Blood pressure added successfully.', type: BaseSuccessResponse })
  @ApiResponse({ status: 403, description: 'Forbidden. Token expired.', type: ForbiddenResponse })
  public addBloodPressure(
    @Req() req,
    @Body() body: UserCardBloodPressureSaveBodyParamsDTO,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.userCardBloodPressureService.addBloodPressure(req.user.id, body, i18n)
  }
}
