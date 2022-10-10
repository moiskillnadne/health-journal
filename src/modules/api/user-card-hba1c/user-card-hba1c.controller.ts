import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { ForbiddenResponse } from '../../../core/dtos/response/forbidden.dto'
import { OptionsResponseDto } from '../../../core/dtos/response/options.dto'
import { IBaseResponse } from '../../../models/response.models'

import { UserCardHba1cService } from './user-card-hba1c.service'

import { UserCardHba1cQueryParamsDto, PostUserCardHba1cHistoryParamsDto } from './dto/user-card-hba1c.dto'
import { GetUserHba1cResponseDto, GetUserHba1cLastRecordResponseDto } from './dto/user-card-hba1c.response.dto'

@ApiTags('User Hba1c')
@Controller('user/hba1c')
export class UserCardHba1cController {
  constructor(private userCardHba1cService: UserCardHba1cService) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserHba1cResponseDto, isArray: true })
  public getUserRandomBloodSugar(
    @Req() { user },
    @Query() params: UserCardHba1cQueryParamsDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.userCardHba1cService.getUserHba1cByParams(user.id, params, i18n)
  }

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserHba1cLastRecordResponseDto })
  public getUserHba1cLastRecord(@Req() { user }, @I18n() i18n: I18nContext) {
    return this.userCardHba1cService.getUserHba1cLastRecordByUserId(user.id, i18n)
  }

  @Get('options')
  @ApiOkResponse({ type: OptionsResponseDto, isArray: true })
  public getHba1cList(): OptionsResponseDto[] {
    return this.userCardHba1cService.getHba1cList()
  }

  @Post()
  @ApiResponse({ status: 201, type: BaseSuccessResponse })
  @ApiResponse({ status: 403, type: ForbiddenResponse })
  public addHba1cRecordToUserCard(
    @Req() req,
    @Body() body: PostUserCardHba1cHistoryParamsDto,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.userCardHba1cService.addHba1cRecord(req.user.id, body, i18n)
  }
}
