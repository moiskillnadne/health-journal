import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { I18n, I18nContext } from 'nestjs-i18n'
import { UserCardSleepService } from './user-card-sleep.service'
import { GetUserCardSleepHistoryLastRecordResponseDto } from './dto/user-card-sleep-response.dto'
import { UserCardSleepBodyParamsDto } from './dto/user-card-sleep.dto'
import { IBaseResponse } from '../../../models/response.models'
import { BaseSuccessResponse } from '../../../core/dtos/response/base-success.dto'

@ApiTags('User Sleep')
@Controller('user/sleep')
export class UserCardSleepController {
  constructor(private userCardSleepService: UserCardSleepService) {}

  @Get('latest')
  @ApiResponse({ status: 200, type: GetUserCardSleepHistoryLastRecordResponseDto })
  public getLatestRecordSleepHistory(
    @Req() { user },
    @I18n() i18n: I18nContext,
  ): Promise<GetUserCardSleepHistoryLastRecordResponseDto> {
    return this.userCardSleepService.getLatestSleepHistoryRecord(user.id, i18n)
  }

  @Post()
  @ApiResponse({ status: 201, type: BaseSuccessResponse })
  public saveSleedRecord(
    @Req() { user },
    @I18n() i18n: I18nContext,
    @Body() body: UserCardSleepBodyParamsDto,
  ): Promise<IBaseResponse> {
    return this.userCardSleepService.saveSleepRecord(user.id, i18n, body)
  }
}
