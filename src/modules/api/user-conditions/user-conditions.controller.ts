import { Body, Controller, Get, ParseArrayPipe, Patch, Post, Query, Req } from '@nestjs/common'
import { ApiCreatedResponse, ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { ForbiddenResponse } from '../../../core/dtos/response/forbidden.dto'
import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'
import { IBaseResponse } from '../../../models/response.models'

import { UserConditionsService } from './user-conditions.service'

import { ConditionParamsOptionalDto, PatchUserConditionParamsDto } from './dto/user-condition.dto'
import { UserConditionsResponseDto } from './dto/user-condition.response.dto'
import { PaginationOptionsDTO } from '../../../core/dtos/pagination'
import { ApiPageResponse } from '../../../core/decorators/swagger/api-page-response.decorator'

@ApiTags('User Conditions')
@Controller('user/conditions')
export class UserConditionsController {
  constructor(private userConditionsService: UserConditionsService) {}

  @Post()
  @ApiCreatedResponse({ type: BaseSuccessResponse })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  public saveUserCondition(
    @Req() { user },
    @Body(new ParseArrayPipe({ items: ConditionParamsOptionalDto })) body: ConditionParamsOptionalDto[],
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.userConditionsService.saveUserCondition(user.id, body, i18n)
  }

  @Patch('resolve')
  @ApiCreatedResponse({ type: BaseSuccessResponse })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  public makeConditionResolved(
    @Body() body: PatchUserConditionParamsDto,
    @I18n() i18n: I18nContext,
  ): Promise<IBaseResponse> {
    return this.userConditionsService.makeUserConditionResolved(body, i18n)
  }

  @Get('current')
  @ApiResponse({ status: 200, type: UserConditionsResponseDto, isArray: true })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  public getUserCurrentConditions(@Req() { user }): Promise<UserConditionsResponseDto[]> {
    return this.userConditionsService.getUserCurrentConditions(user.id)
  }

  @Get('resolved')
  @ApiPageResponse(UserConditionsResponseDto, { status: 200 })
  public getUserResolvedConditions(@Req() { user }, @Query() query: PaginationOptionsDTO) {
    return this.userConditionsService.getUserResolvedConditions(user.id, query)
  }
}
